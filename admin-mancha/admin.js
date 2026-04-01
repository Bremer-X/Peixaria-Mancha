document.addEventListener("DOMContentLoaded", () => {

  const EDGE_FUNCTION_URL = "https://kgyhrapfhfkwgejquyjx.supabase.co/functions/v1/admin-handler";

  const loginForm = document.getElementById("login-form");
  const settingsForm = document.getElementById("ai-settings-form");
  const errorMsg = document.getElementById("login-error");
  const statusMsg = document.getElementById("status-message");
  const title = document.getElementById("panel-title");
  const subtitle = document.getElementById("panel-subtitle");
  const logoutBtn = document.getElementById("logout-btn");

  let authToken = sessionStorage.getItem("admin_token") || null;

  function showLogin() {
    loginForm.classList.remove("hidden");
    settingsForm.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    title.innerText = "Acesso Administrativo";
    subtitle.innerText = "Acesso restrito à configuração de Inteligência Artificial.";
  }

  async function showSettings() {
    loginForm.classList.add("hidden");
    settingsForm.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    title.innerText = "Configuração IA";
    subtitle.innerText = "Gerencie as configurações da assistente virtual.";

    await loadSettings();
  }

  async function loadSettings() {
    if (!authToken) return;

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ action: "get_config" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar configurações.");
      }

      if (data.config) {
        document.getElementById('apikey').value = data.config.api_key || '';
        document.getElementById('sysprompt').value = data.config.system_prompt || '';
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      showError("Falha ao carregar configurações do servidor.");
    }
  }

  function showError(message) {
    errorMsg.innerText = message;
    errorMsg.classList.remove('hidden');
    errorMsg.classList.add('text-red-400');
    errorMsg.classList.remove('text-green-400');
  }

  function showStatus(message, type = "success") {
    statusMsg.innerText = message;
    statusMsg.classList.remove('hidden', 'text-green-400', 'text-red-400');
    statusMsg.classList.add(type === "success" ? "text-green-400" : "text-red-400");
    setTimeout(() => statusMsg.classList.add("hidden"), 5000);
  }

  // Login via Edge Function
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;

    if (!email || !pass) {
      showError("Preencha todos os campos.");
      return;
    }

    const btn = document.getElementById("btn-login");
    btn.disabled = true;
    btn.innerText = "Autenticando...";

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email,
          password: pass
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciais inválidas.");
      }

      authToken = data.token;
      sessionStorage.setItem("admin_token", authToken);
      showSettings();

    } catch (error) {
      showError(error.message || "Erro de conexão. Tente novamente.");
    } finally {
      btn.disabled = false;
      btn.innerText = "Fazer Login";
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    authToken = null;
    sessionStorage.removeItem("admin_token");
    showLogin();
  });

  // Salvar configurações via Edge Function
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusMsg.classList.add("hidden");

    const btn = document.getElementById("save-btn");
    btn.disabled = true;
    btn.innerText = "Salvando...";

    const apiKey = document.getElementById("apikey").value.trim();
    const sysPrompt = document.getElementById("sysprompt").value.trim();

    if (!apiKey || !sysPrompt) {
      showStatus("Preencha todos os campos.", "error");
      btn.disabled = false;
      btn.innerText = "Salvar Configurações";
      return;
    }

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: "update_config",
          api_key: apiKey,
          system_prompt: sysPrompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar configurações.");
      }

      showStatus("Configurações salvas com sucesso!");

    } catch (error) {
      showStatus(error.message || "Erro ao salvar configurações.", "error");
    } finally {
      btn.disabled = false;
      btn.innerText = "Salvar Configurações";
    }
  });

  // Verificar sessão ao carregar
  async function checkAuth() {
    if (!authToken) {
      showLogin();
      return;
    }

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ action: "verify" })
      });

      if (!response.ok) {
        throw new Error("Token inválido");
      }

      showSettings();
    } catch {
      authToken = null;
      sessionStorage.removeItem("admin_token");
      showLogin();
    }
  }

  checkAuth();
});
