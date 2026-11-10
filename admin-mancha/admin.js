document.addEventListener("DOMContentLoaded", () => {
  // Detecta automaticamente a URL da API Node.js/Express
  const API_BASE = window.location.port === "3001"
    ? "/api"
    : "http://localhost:3001/api";

  let authToken = localStorage.getItem("mancha_admin_token") || null;
  let currentPeriod = "all";
  let catalogData = { config: {}, categories: [], allProducts: [] };
  let dashboardData = null;

  // Elementos principais
  const loginScreen = document.getElementById("login-screen");
  const adminApp = document.getElementById("admin-app");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const dbStatusBadge = document.getElementById("db-status-badge");
  const toastEl = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function showToast(msg, isError = false) {
    toastText.textContent = msg;
    toastEl.className = `fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl font-montserrat font-bold text-xs flex items-center gap-2 transition-all ${
      isError ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
    }`;
    toastEl.classList.remove("hidden");
    setTimeout(() => toastEl.classList.add("hidden"), 4000);
  }

  function formatBRL(val) {
    return `R$ ${Number(val || 0).toFixed(2).replace(".", ",")}`;
  }

  async function apiFetch(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    };
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Erro na comunicação com o servidor.");
    }
    return data;
  }

  // ==========================================================================
  // AUTENTICAÇÃO E SESSÃO
  // ==========================================================================

  function updateDbBadge(dbMode) {
    if (dbMode === "mongodb") {
      dbStatusBadge.textContent = "MongoDB Ativo";
      dbStatusBadge.className = "text-[10px] font-montserrat font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    } else {
      dbStatusBadge.textContent = "Modo Local (Aguardando URI MongoDB)";
      dbStatusBadge.className = "text-[10px] font-montserrat font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }
  }

  async function checkSession() {
    if (!authToken) {
      showLoginScreen();
      return;
    }
    try {
      const verify = await apiFetch("/auth/verify");
      updateDbBadge(verify.dbMode);
      if (verify.admin?.email) {
        document.getElementById("cred-email").value = verify.admin.email;
      }
      showAdminApp();
      await loadAllData();
    } catch {
      authToken = null;
      localStorage.removeItem("mancha_admin_token");
      showLoginScreen();
    }
  }

  function showLoginScreen() {
    loginScreen.classList.remove("hidden");
    adminApp.classList.add("hidden");
    refreshIcons();
  }

  function showAdminApp() {
    loginScreen.classList.add("hidden");
    adminApp.classList.remove("hidden");
    refreshIcons();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.add("hidden");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-submit-btn");
    btn.disabled = true;
    btn.textContent = "Autenticando...";

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      authToken = data.token;
      localStorage.setItem("mancha_admin_token", authToken);
      updateDbBadge(data.dbMode);
      document.getElementById("cred-email").value = data.email || email;
      showAdminApp();
      await loadAllData();
      showToast("Bem-vindo ao Painel da Peixaria Mancha!");
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar no Painel";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    authToken = null;
    localStorage.removeItem("mancha_admin_token");
    showLoginScreen();
  });

  document.getElementById("refresh-all-btn").addEventListener("click", async () => {
    await loadAllData();
    showToast("Dados atualizados!");
  });

  // ==========================================================================
  // NAVEGAÇÃO DE ABAS
  // ==========================================================================

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanels.forEach(panel => {
        if (panel.id === `tab-${target}`) {
          panel.classList.remove("hidden");
        } else {
          panel.classList.add("hidden");
        }
      });
      refreshIcons();
    });
  });

  // ==========================================================================
  // CARREGAMENTO CENTRAL DE DADOS
  // ==========================================================================

  async function loadAllData() {
    await Promise.all([
      loadCatalog(),
      loadDashboard(currentPeriod)
    ]);
  }

  async function loadCatalog() {
    const data = await apiFetch("/delivery/catalog?all=true");
    catalogData = data;
    updateDbBadge(data.dbMode);
    populateCategorySelectors();
    renderProductsTab();
    renderCategoriesTab();
    populateSettingsForm(data.config || {});

    // Sincronizar backup no localStorage do navegador para caso o cardápio seja aberto via file://
    try {
      localStorage.setItem("peixaria_mancha_catalog_cache", JSON.stringify(data));
    } catch {}
  }

  async function loadDashboard(period = "all") {
    currentPeriod = period;
    const data = await apiFetch(`/admin/dashboard?period=${period}`);
    dashboardData = data;
    renderDashboard();
    renderOrdersTab();
  }

  // Filtro de período no Dashboard
  document.querySelectorAll(".period-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".period-btn").forEach(b => {
        b.classList.remove("bg-[#b21818]", "text-white");
        b.classList.add("text-slate-300");
      });
      btn.classList.add("bg-[#b21818]", "text-white");
      btn.classList.remove("text-slate-300");
      loadDashboard(btn.getAttribute("data-period"));
    });
  });

  // ==========================================================================
  // RENDERIZAR ABA 1: DASHBOARD & RANKING MAIS VENDIDOS
  // ==========================================================================

  function renderDashboard() {
    if (!dashboardData) return;
    const { kpis, byModality, byPayment, topProductsByQty, categoryPerformance, dailySales, recentOrders } = dashboardData;

    document.getElementById("kpi-revenue").textContent = formatBRL(kpis.totalRevenue);
    document.getElementById("kpi-orders").textContent = kpis.totalOrders;
    document.getElementById("kpi-modality-split").textContent = `${byModality.delivery || 0} Entrega • ${byModality.pickup || 0} Retirada`;
    document.getElementById("kpi-ticket").textContent = formatBRL(kpis.avgTicket);
    document.getElementById("kpi-active-products").textContent = `${kpis.activeProductsCount} / ${kpis.totalProductsCount}`;
    document.getElementById("nav-orders-badge").textContent = recentOrders.length;

    // 1. Top Produtos Mais Vendidos
    const topContainer = document.getElementById("top-products-list");
    if (!topProductsByQty || topProductsByQty.length === 0) {
      topContainer.innerHTML = `
        <div class="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
          <p class="font-montserrat font-bold text-sm text-slate-300">Ainda não há vendas registradas neste período</p>
          <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">Assim que os clientes enviarem pedidos pelo Cardápio Delivery (ou se você clicar em "+ Gerar Pedido Exemplo"), o ranking dos peixes e porções mais vendidos aparecerá aqui.</p>
        </div>
      `;
    } else {
      const maxQty = Math.max(...topProductsByQty.map(p => p.quantitySold), 1);
      topContainer.innerHTML = topProductsByQty.slice(0, 10).map((item, idx) => {
        const pct = Math.round((item.quantitySold / maxQty) * 100);
        const medalColor = idx === 0
          ? "bg-amber-400 text-black font-black"
          : idx === 1
          ? "bg-slate-300 text-black font-black"
          : idx === 2
          ? "bg-amber-700 text-white font-black"
          : "bg-white/10 text-slate-300 font-bold";

        const portionsText = Object.entries(item.portionsBreakdown || {})
          .map(([p, q]) => `${q}x ${p}`)
          .join(" • ");

        return `
          <div class="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all">
            <div class="flex items-center justify-between gap-3 mb-2">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-7 h-7 rounded-full text-xs flex items-center justify-center flex-shrink-0 ${medalColor}">
                  ${idx + 1}º
                </span>
                <div class="min-w-0">
                  <h4 class="font-montserrat font-extrabold text-xs sm:text-sm text-white truncate">${item.name}</h4>
                  <p class="text-[11px] text-slate-400 truncate">${portionsText || "Porção padrão"}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <span class="font-montserrat font-black text-xs sm:text-sm text-amber-400 block">${item.quantitySold} vendidos</span>
                <span class="text-[11px] font-bold text-emerald-400">${formatBRL(item.revenue)}</span>
              </div>
            </div>
            <div class="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#b21818] to-[#d97706] rounded-full" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // 2. Desempenho por Categoria
    const catStatsEl = document.getElementById("category-stats-list");
    const totalCatRev = Math.max(categoryPerformance.reduce((s, c) => s + c.revenue, 0), 1);
    catStatsEl.innerHTML = categoryPerformance.map(cat => {
      const pct = Math.round((cat.revenue / totalCatRev) * 100);
      return `
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="font-montserrat font-bold text-slate-200">${cat.title}</span>
            <span class="font-bold text-amber-400">${cat.quantity} itens • ${formatBRL(cat.revenue)}</span>
          </div>
          <div class="w-full h-2 bg-black/50 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full" style="width: ${cat.revenue > 0 ? Math.max(pct, 6) : 0}%"></div>
          </div>
        </div>
      `;
    }).join("");

    // 3. Formas de Pagamento
    const payLabels = {
      pix: { label: "PIX", color: "text-emerald-400" },
      credit: { label: "Crédito", color: "text-amber-400" },
      debit: { label: "Débito", color: "text-sky-400" },
      cash: { label: "Dinheiro", color: "text-purple-400" }
    };
    document.getElementById("payment-stats-list").innerHTML = Object.entries(payLabels).map(([key, info]) => `
      <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <span class="font-montserrat font-bold text-slate-300">${info.label}</span>
        <span class="font-montserrat font-black text-sm ${info.color}">${byPayment[key] || 0}</span>
      </div>
    `).join("");

    // 4. Vendas últimos 7 dias
    document.getElementById("daily-sales-list").innerHTML = (dailySales || []).map(d => `
      <div class="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
        <span class="text-slate-300 font-medium capitalize">${d.label}</span>
        <div class="flex items-center gap-3">
          <span class="text-slate-400">${d.orders} ped.</span>
          <span class="font-montserrat font-bold text-emerald-400 w-20 text-right">${formatBRL(d.revenue)}</span>
        </div>
      </div>
    `).join("");

    refreshIcons();
  }

  // Botão para simular um pedido de exemplo e ver o Dashboard funcionando na hora
  document.getElementById("simulate-order-btn").addEventListener("click", async () => {
    try {
      const sampleOrder = {
        customer: {
          name: "Cliente Teste Delivery",
          whatsapp: "(91) 98888-7777",
          modality: "delivery",
          address: "Av. Augusto Montenegro, Belém - PA",
          reference: "Próximo ao supermercado"
        },
        payment: { method: "pix", changeFor: "" },
        items: [
          {
            menuItemId: "frito-file-filhote",
            name: "FILÉ DE FILHOTE FRITO (KG)",
            categoryId: "peixes-fritos",
            portion: "1 KG",
            price: 88,
            quantity: 1
          },
          {
            menuItemId: "assado-tambaqui",
            name: "TAMBAQUI A PARTIR (BANDA)",
            categoryId: "peixes-assados",
            portion: "Banda",
            price: 100,
            quantity: 1
          },
          {
            menuItemId: "acomp-baiao",
            name: "BAIÃO DE DOIS",
            categoryId: "porcoes-acompanhamento",
            portion: "500g",
            price: 16,
            quantity: 2
          }
        ],
        totalAmount: 220,
        generalNotes: "Pedido de exemplo gerado pelo painel para visualização do Dashboard."
      };

      await apiFetch("/delivery/orders", {
        method: "POST",
        body: JSON.stringify(sampleOrder)
      });
      await loadDashboard(currentPeriod);
      showToast("Pedido de exemplo registrado! Veja o ranking atualizado.");
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // ==========================================================================
  // RENDERIZAR ABA 2: PRODUTOS & EDIÇÃO RÁPIDA
  // ==========================================================================

  function populateCategorySelectors() {
    const filterSelect = document.getElementById("admin-product-cat-filter");
    const modalSelect = document.getElementById("prod-categoryId");
    const currentFilter = filterSelect.value || "all";

    const cats = catalogData.categories || [];
    filterSelect.innerHTML = `<option value="all">Todas as Categorias (${cats.length})</option>` +
      cats.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
    filterSelect.value = currentFilter;

    modalSelect.innerHTML = cats.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
  }

  function renderProductsTab() {
    const grid = document.getElementById("admin-products-grid");
    const search = (document.getElementById("admin-product-search").value || "").toLowerCase().trim();
    const catFilter = document.getElementById("admin-product-cat-filter").value;

    const catsMap = {};
    (catalogData.categories || []).forEach(c => { catsMap[c.id] = c.title; });

    const filtered = (catalogData.allProducts || []).filter(p => {
      if (catFilter !== "all" && p.categoryId !== catFilter) return false;
      if (!search) return true;
      return (
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search)) ||
        (p.badge && p.badge.toLowerCase().includes(search))
      );
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-sm">Nenhum produto encontrado para este filtro.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const available = prod.isAvailable !== false;
      const priceText = prod.unitType === "PORÇÃO"
        ? `${prod.price250ml ? `250g: ${formatBRL(prod.price250ml)} • ` : ""}500g: ${formatBRL(prod.price500ml || prod.price)}`
        : `${formatBRL(prod.price)} / ${prod.unitType || "UN"}`;

      return `
        <div class="glass-card rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all ${available ? "border-white/10" : "opacity-60 border-red-500/30 bg-red-950/10"}">
          <div class="flex items-start gap-3.5">
            ${prod.image ? `
              <img src="${prod.image}" alt="${prod.name}" class="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 bg-black/40">
            ` : `
              <div class="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-amber-400 font-bebas text-xl">
                ${prod.unitType || "PEIXE"}
              </div>
            `}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-montserrat font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  ${catsMap[prod.categoryId] || prod.categoryId}
                </span>
                ${prod.badge ? `<span class="text-[10px] font-montserrat font-bold uppercase text-white bg-[#b21818] px-2 py-0.5 rounded-md">${prod.badge}</span>` : ""}
                ${prod.isPopular ? `<span class="text-[10px] font-montserrat font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">★ Destaque</span>` : ""}
              </div>
              <h4 class="font-montserrat font-black text-sm text-white mt-1 leading-snug">${prod.name}</h4>
              <p class="text-xs text-slate-400 line-clamp-2 mt-0.5">${prod.description || "Sem descrição"}</p>
            </div>
          </div>

          <div class="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-[10px] uppercase font-montserrat font-bold text-slate-400 block">Preço Atual</span>
              <span class="font-bebas text-2xl text-emerald-400 tracking-wide">${priceText}</span>
            </div>

            <div class="flex items-center gap-2">
              <button type="button" data-toggle-avail="${prod.id}"
                class="px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold border transition-all cursor-pointer ${
                  available
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                    : "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                }">
                ${available ? "● Ativo" : "○ Pausado"}
              </button>

              <button type="button" data-edit-prod="${prod.id}"
                class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-bold transition-all cursor-pointer">
                Editar
              </button>

              <button type="button" data-del-prod="${prod.id}" title="Excluir produto"
                class="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Eventos dos botões de cada produto
    grid.querySelectorAll("[data-toggle-avail]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-toggle-avail");
        const prod = catalogData.allProducts.find(p => p.id === id);
        if (!prod) return;
        try {
          await apiFetch(`/admin/products/${id}`, {
            method: "PUT",
            body: JSON.stringify({ isAvailable: prod.isAvailable === false })
          });
          await loadCatalog();
          await loadDashboard(currentPeriod);
          showToast(`Status de "${prod.name}" atualizado!`);
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    grid.querySelectorAll("[data-edit-prod]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-prod");
        const prod = catalogData.allProducts.find(p => p.id === id);
        if (prod) openProductModal(prod);
      });
    });

    grid.querySelectorAll("[data-del-prod]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-prod");
        const prod = catalogData.allProducts.find(p => p.id === id);
        if (!prod || !confirm(`Deseja realmente excluir "${prod.name}" do cardápio?`)) return;
        try {
          await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
          await loadCatalog();
          showToast("Produto removido!");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  document.getElementById("admin-product-search").addEventListener("input", renderProductsTab);
  document.getElementById("admin-product-cat-filter").addEventListener("change", renderProductsTab);

  // Modal de Produto
  const productModal = document.getElementById("product-modal");
  const productForm = document.getElementById("product-form");

  function openProductModal(prod = null) {
    document.getElementById("prod-is-edit").value = prod ? "true" : "false";
    document.getElementById("product-modal-title").textContent = prod ? "Editar Produto" : "Adicionar Novo Produto";
    document.getElementById("prod-id").value = prod ? prod.id : "";
    document.getElementById("prod-name").value = prod ? prod.name : "";
    document.getElementById("prod-categoryId").value = prod ? prod.categoryId : (catalogData.categories[0]?.id || "peixes-fritos");
    document.getElementById("prod-description").value = prod ? (prod.description || "") : "";
    document.getElementById("prod-unitType").value = prod ? (prod.unitType || "KG") : "KG";
    document.getElementById("prod-badge").value = prod ? (prod.badge || "") : "";
    document.getElementById("prod-serves").value = prod ? (prod.serves || "") : "";
    document.getElementById("prod-price").value = prod && prod.price ? prod.price : "";
    document.getElementById("prod-price250ml").value = prod && prod.price250ml ? prod.price250ml : "";
    document.getElementById("prod-price500ml").value = prod && prod.price500ml ? prod.price500ml : "";
    document.getElementById("prod-allowWeightChoice").checked = prod ? Boolean(prod.allowWeightChoice) : true;
    document.getElementById("prod-isPopular").checked = prod ? Boolean(prod.isPopular) : false;
    document.getElementById("prod-isAvailable").checked = prod ? prod.isAvailable !== false : true;
    document.getElementById("prod-image").value = prod ? (prod.image || "") : "";

    productModal.classList.remove("hidden");
    productModal.classList.add("flex");
  }

  function closeProductModal() {
    productModal.classList.add("hidden");
    productModal.classList.remove("flex");
  }

  document.getElementById("new-product-btn").addEventListener("click", () => openProductModal(null));
  document.getElementById("close-product-modal").addEventListener("click", closeProductModal);
  document.getElementById("cancel-product-modal").addEventListener("click", closeProductModal);

  // Upload de imagem convertendo para Base64 otimizado
  document.getElementById("prod-image-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("prod-image").value = reader.result;
      showToast("Foto carregada! Clique em Salvar Produto.");
    };
    reader.readAsDataURL(file);
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEdit = document.getElementById("prod-is-edit").value === "true";
    const id = document.getElementById("prod-id").value;

    const payload = {
      name: document.getElementById("prod-name").value.trim(),
      categoryId: document.getElementById("prod-categoryId").value,
      description: document.getElementById("prod-description").value.trim(),
      unitType: document.getElementById("prod-unitType").value,
      badge: document.getElementById("prod-badge").value.trim(),
      serves: document.getElementById("prod-serves").value.trim(),
      price: document.getElementById("prod-price").value ? Number(document.getElementById("prod-price").value) : 0,
      price250ml: document.getElementById("prod-price250ml").value ? Number(document.getElementById("prod-price250ml").value) : null,
      price500ml: document.getElementById("prod-price500ml").value ? Number(document.getElementById("prod-price500ml").value) : null,
      allowWeightChoice: document.getElementById("prod-allowWeightChoice").checked,
      isPopular: document.getElementById("prod-isPopular").checked,
      isAvailable: document.getElementById("prod-isAvailable").checked,
      image: document.getElementById("prod-image").value.trim()
    };

    try {
      if (isEdit && id) {
        await apiFetch(`/admin/products/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        showToast("Produto atualizado com sucesso!");
      } else {
        await apiFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showToast("Novo produto adicionado ao cardápio!");
      }
      closeProductModal();
      await loadCatalog();
      await loadDashboard(currentPeriod);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // ==========================================================================
  // RENDERIZAR ABA 3: PEDIDOS RECEBIDOS
  // ==========================================================================

  function renderOrdersTab() {
    const listEl = document.getElementById("admin-orders-list");
    const orders = dashboardData?.recentOrders || [];

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="glass-card rounded-3xl p-10 text-center text-slate-400">
          <p class="font-montserrat font-bold text-base text-white">Nenhum pedido registrado ainda</p>
          <p class="text-xs mt-1">Quando um cliente finalizar um pedido no Delivery, ele ficará salvo aqui com todos os itens e valores.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = orders.map(ord => {
      const orderId = ord._id || ord.orderNumber;
      const dateStr = new Date(ord.createdAt).toLocaleString("pt-BR");
      const cleanPhone = (ord.customer?.whatsapp || "").replace(/\D/g, "");
      const waLink = cleanPhone ? `https://wa.me/55${cleanPhone.replace(/^55/, "")}` : "#";

      return `
        <div class="glass-card rounded-2xl p-5 space-y-3 border border-white/10">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div class="flex items-center gap-3">
              <span class="bg-[#b21818] text-white font-montserrat font-black text-xs px-3 py-1 rounded-lg">
                ${ord.orderCode || "#" + ord.orderNumber}
              </span>
              <div>
                <h4 class="font-montserrat font-extrabold text-sm text-white">${ord.customer?.name || "Cliente"}</h4>
                <span class="text-[11px] text-slate-400">${dateStr} • ${ord.customer?.modality === "pickup" ? "Retirada no Balcão" : "Entrega (Delivery)"}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <select data-order-status="${orderId}" class="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-montserrat font-bold text-amber-300">
                <option value="novo" ${ord.status === "novo" ? "selected" : ""}>Novo Pedido</option>
                <option value="confirmado" ${ord.status === "confirmado" ? "selected" : ""}>Confirmado</option>
                <option value="preparo" ${ord.status === "preparo" ? "selected" : ""}>Em Preparo</option>
                <option value="saiu_entrega" ${ord.status === "saiu_entrega" ? "selected" : ""}>Saiu p/ Entrega</option>
                <option value="concluido" ${ord.status === "concluido" ? "selected" : ""}>Concluído</option>
                <option value="cancelado" ${ord.status === "cancelado" ? "selected" : ""}>Cancelado</option>
              </select>
              ${cleanPhone ? `
                <a href="${waLink}" target="_blank" class="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold">
                  WhatsApp
                </a>
              ` : ""}
              <button data-del-order="${orderId}" class="p-1.5 text-slate-400 hover:text-red-400 cursor-pointer" title="Excluir registro">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Itens do Pedido:</span>
              ${(ord.items || []).map(it => `
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-slate-200 font-semibold">${it.quantity}x ${it.name} ${it.portion ? `(${it.portion})` : ""}</span>
                  <span class="text-amber-400 font-bold">${formatBRL(it.subtotal)}</span>
                </div>
              `).join("")}
            </div>
            <div class="space-y-1 text-slate-300">
              <p><strong>Endereço:</strong> ${ord.customer?.address || "Retirada no local"} ${ord.customer?.reference ? `(${ord.customer.reference})` : ""}</p>
              <p><strong>Pagamento:</strong> ${(ord.payment?.method || "PIX").toUpperCase()} ${ord.payment?.changeFor ? `(Troco p/ ${ord.payment.changeFor})` : ""}</p>
              ${ord.generalNotes ? `<p><strong>Obs:</strong> ${ord.generalNotes}</p>` : ""}
              <p class="pt-2 font-bebas text-2xl text-emerald-400">TOTAL: ${formatBRL(ord.totalAmount)}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll("[data-order-status]").forEach(sel => {
      sel.addEventListener("change", async () => {
        const id = sel.getAttribute("data-order-status");
        try {
          await apiFetch(`/admin/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: sel.value })
          });
          await loadDashboard(currentPeriod);
          showToast("Status do pedido atualizado!");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    listEl.querySelectorAll("[data-del-order]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-order");
        if (!confirm("Remover este pedido do histórico?")) return;
        try {
          await apiFetch(`/admin/orders/${id}`, { method: "DELETE" });
          await loadDashboard(currentPeriod);
          showToast("Pedido removido.");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  // ==========================================================================
  // RENDERIZAR ABA 4: CATEGORIAS
  // ==========================================================================

  function renderCategoriesTab() {
    const container = document.getElementById("admin-categories-list");
    const cats = catalogData.categories || [];

    container.innerHTML = cats.map(cat => `
      <div class="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 border border-white/10">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-montserrat font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
              Ordem #${cat.order || 1}
            </span>
            <span class="text-xs text-slate-400">${(cat.items || []).length} produtos</span>
          </div>
          <h3 class="font-bebas text-2xl text-white mt-2 tracking-wide">${cat.title}</h3>
          <p class="text-xs text-slate-400">${cat.subtitle || "Sem subtítulo"}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <span class="text-[11px] text-slate-400">${cat.type === "portion-columns" ? "Colunas 250g/500g" : "Card Padrão"}</span>
          <div class="flex items-center gap-2">
            <button data-edit-cat="${cat.id}" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-montserrat font-bold text-white cursor-pointer">
              Editar
            </button>
            <button data-del-cat="${cat.id}" class="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-red-400 cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    container.querySelectorAll("[data-edit-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = cats.find(c => c.id === btn.getAttribute("data-edit-cat"));
        if (cat) openCategoryModal(cat);
      });
    });

    container.querySelectorAll("[data-del-cat]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-cat");
        if (!confirm("Excluir esta categoria?")) return;
        try {
          await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
          await loadCatalog();
          showToast("Categoria excluída!");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  const categoryModal = document.getElementById("category-modal");
  const categoryForm = document.getElementById("category-form");

  function openCategoryModal(cat = null) {
    document.getElementById("cat-is-edit").value = cat ? "true" : "false";
    document.getElementById("category-modal-title").textContent = cat ? "Editar Categoria" : "Nova Categoria";
    document.getElementById("cat-id").value = cat ? cat.id : "";
    document.getElementById("cat-title").value = cat ? cat.title : "";
    document.getElementById("cat-subtitle").value = cat ? (cat.subtitle || "") : "";
    document.getElementById("cat-type").value = cat ? (cat.type || "single") : "single";
    document.getElementById("cat-order").value = cat ? (cat.order || 1) : (catalogData.categories.length + 1);

    categoryModal.classList.remove("hidden");
    categoryModal.classList.add("flex");
  }

  function closeCategoryModal() {
    categoryModal.classList.add("hidden");
    categoryModal.classList.remove("flex");
  }

  document.getElementById("new-category-btn").addEventListener("click", () => openCategoryModal(null));
  document.getElementById("close-category-modal").addEventListener("click", closeCategoryModal);
  document.getElementById("cancel-category-modal").addEventListener("click", closeCategoryModal);

  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEdit = document.getElementById("cat-is-edit").value === "true";
    const id = document.getElementById("cat-id").value;
    const payload = {
      title: document.getElementById("cat-title").value.trim(),
      subtitle: document.getElementById("cat-subtitle").value.trim(),
      type: document.getElementById("cat-type").value,
      order: Number(document.getElementById("cat-order").value || 1)
    };

    try {
      if (isEdit && id) {
        await apiFetch(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Categoria atualizada!");
      } else {
        await apiFetch("/admin/categories", { method: "POST", body: JSON.stringify(payload) });
        showToast("Categoria criada!");
      }
      closeCategoryModal();
      await loadCatalog();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // ==========================================================================
  // ABA 5: CONFIGURAÇÕES DA LOJA, HORÁRIO E MONGODB
  // ==========================================================================

  function populateSettingsForm(cfg) {
    document.getElementById("cfg-manualStatus").value = cfg.manualStatus || "auto";
    document.getElementById("cfg-openHour").value = cfg.openHour ?? 7;
    document.getElementById("cfg-closeHour").value = cfg.closeHour ?? 14;
    document.getElementById("cfg-scheduleLabel").value = cfg.scheduleLabel || "Todos os dias das 07h às 14h";
    document.getElementById("cfg-estimatedTime").value = cfg.estimatedTime || "30-50 min";
    document.getElementById("cfg-whatsapp").value = cfg.whatsapp || "5591989379978";
    document.getElementById("cfg-phoneFormatted").value = cfg.phoneFormatted || "(91) 98937-9978";
    document.getElementById("cfg-tagline").value = cfg.tagline || "";
    document.getElementById("cfg-deliveryFeeNotice").value = cfg.deliveryFeeNotice || "";
  }

  document.getElementById("store-config-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      manualStatus: document.getElementById("cfg-manualStatus").value,
      openHour: Number(document.getElementById("cfg-openHour").value),
      closeHour: Number(document.getElementById("cfg-closeHour").value),
      scheduleLabel: document.getElementById("cfg-scheduleLabel").value.trim(),
      estimatedTime: document.getElementById("cfg-estimatedTime").value.trim(),
      whatsapp: document.getElementById("cfg-whatsapp").value.trim(),
      phoneFormatted: document.getElementById("cfg-phoneFormatted").value.trim(),
      tagline: document.getElementById("cfg-tagline").value.trim(),
      deliveryFeeNotice: document.getElementById("cfg-deliveryFeeNotice").value.trim()
    };

    try {
      await apiFetch("/admin/config", { method: "PUT", body: JSON.stringify(payload) });
      await loadCatalog();
      showToast("Configurações do Delivery salvas com sucesso!");
    } catch (err) {
      showToast(err.message, true);
    }
  });

  document.getElementById("mongo-config-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mongoUri = document.getElementById("mongo-uri-input").value.trim();
    const btn = document.getElementById("save-mongo-btn");
    btn.disabled = true;
    btn.textContent = "Conectando ao MongoDB...";

    try {
      const res = await apiFetch("/admin/database", {
        method: "POST",
        body: JSON.stringify({ mongoUri })
      });
      updateDbBadge(res.dbMode);
      await loadAllData();
      showToast(res.message);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = "Conectar e Sincronizar MongoDB";
    }
  });

  document.getElementById("admin-credentials-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById("cred-email").value.trim();
    const newPassword = document.getElementById("cred-password").value;
    try {
      const res = await apiFetch("/auth/credentials", {
        method: "PUT",
        body: JSON.stringify({ newEmail, newPassword })
      });
      document.getElementById("cred-password").value = "";
      showToast(res.message);
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // Inicializar
  checkSession();
});
