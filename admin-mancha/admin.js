document.addEventListener("DOMContentLoaded", () => {
  // Supabase Nuvem - Projeto Dedicado Peixaria Mancha (qnandyuygrilgptnpaeb)
  const SUPABASE_URL = "https://qnandyuygrilgptnpaeb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYW5keXV5Z3JpbGdwdG5wYWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMTM1MDgsImV4cCI6MjEwOTg4OTUwOH0.kOaTY_X6uq5bjo94bjm1RioTEJ-KBHJX7f948YLbJAs";
  const STORE_SLUG = "peixaria-mancha";
  let currentStoreId = "a08c08d0-8768-44bc-9160-0c679beb89a2";

  // Detecta automaticamente o ambiente (Local com Node.js ou Web/Hospedagem Estática)
  const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const API_BASE = (window.location.port === "3001" || isLocalHost)
    ? (window.location.origin.includes(":3001") ? window.location.origin + "/api" : "http://localhost:3001/api")
    : "/api";

  let isWebMode = true;
  if (localStorage.getItem("mancha_supabase_ref") !== "qnandyuygrilgptnpaeb") {
    localStorage.removeItem("mancha_admin_token");
    localStorage.removeItem("mancha_admin_refresh_token");
    localStorage.removeItem("peixaria_mancha_catalog_cache");
    localStorage.setItem("mancha_supabase_ref", "qnandyuygrilgptnpaeb");
  }
  let authToken = localStorage.getItem("mancha_admin_token") || null;
  let refreshToken = localStorage.getItem("mancha_admin_refresh_token") || null;
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
  const viewTitle = document.getElementById("view-title");
  const viewSubtitle = document.getElementById("view-subtitle");
  const periodWrapper = document.getElementById("period-selector-wrapper");

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function showToast(msg, isError = false) {
    toastText.textContent = msg;
    toastEl.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 transition-all ${
      isError ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
    }`;
    toastEl.classList.remove("hidden");
    setTimeout(() => toastEl.classList.add("hidden"), 4000);
  }

  function formatBRL(val) {
    return `R$ ${Number(val || 0).toFixed(2).replace(".", ",")}`;
  }

  function broadcastSync() {
    try {
      const bc = new BroadcastChannel("mancha-sync");
      bc.postMessage({ type: "SYNC_UPDATED", timestamp: Date.now() });
    } catch {}
  }

  function slugify(str, prefix = "item") {
    const clean = String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return clean || `${prefix}-${Date.now()}`;
  }

  async function tryRefreshSupabaseToken() {
    const storedRefresh = refreshToken || localStorage.getItem("mancha_admin_refresh_token");
    if (!storedRefresh) return false;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ refresh_token: storedRefresh })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.access_token) {
        authToken = data.access_token;
        refreshToken = data.refresh_token || storedRefresh;
        localStorage.setItem("mancha_admin_token", authToken);
        localStorage.setItem("mancha_admin_refresh_token", refreshToken);
        localStorage.setItem("mancha_auth_provider", "supabase");
        return true;
      }
    } catch {}
    return false;
  }

  async function supaFetch(path, options = {}, retry = true) {
    const isJwtToken = authToken && authToken.split(".").length === 3;
    const bearer = isJwtToken ? authToken : SUPABASE_ANON_KEY;
    const headers = {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${bearer}`,
      ...(options.headers || {})
    };

    const res = await fetch(`${SUPABASE_URL}${path}`, {
      cache: "no-store",
      ...options,
      headers
    });

    if (res.status === 401 && retry && isJwtToken) {
      const refreshed = await tryRefreshSupabaseToken();
      if (refreshed) {
        return supaFetch(path, options, false);
      }
      authToken = null;
      localStorage.removeItem("mancha_admin_token");
      return supaFetch(path, options, false);
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || errBody.error_description || errBody.error || `Erro Supabase (${res.status})`);
    }

    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function apiFetch(endpoint, options = {}) {
    return handleSupabaseApi(endpoint, options);
  }

  // ==========================================================================
  // MOTOR OFICIAL SUPABASE NUVEM (CATÁLOGO, PRODUTOS, CATEGORIAS, CONFIG E PEDIDOS)
  // ==========================================================================

  function savePublicAndAdminCache(dataObj) {
    if (!dataObj) return;
    try {
      localStorage.setItem("peixaria_mancha_admin_catalog_cache", JSON.stringify(dataObj));
      const publicCopy = {
        ...dataObj,
        categories: (dataObj.categories || [])
          .filter(c => c.isActive !== false)
          .map(c => ({
            ...c,
            items: (c.items || []).filter(it => it.isAvailable !== false)
          })),
        allProducts: (dataObj.allProducts || []).filter(p => p.isAvailable !== false)
      };
      localStorage.setItem("peixaria_mancha_catalog_cache", JSON.stringify(publicCopy));
    } catch {}
  }

  function saveWebCatalog() {
    savePublicAndAdminCache(catalogData);
    broadcastSync();
  }

  function mapOrderStatusFromDb(dbStatus, kitchenNote = "") {
    if (dbStatus === "recusado") return "cancelado";
    if (dbStatus === "rota") return "saiu_entrega";
    if (dbStatus === "preparo" && String(kitchenNote || "").includes("[CONFIRMADO]")) return "confirmado";
    return dbStatus || "novo";
  }

  function mapOrderStatusToDb(uiStatus) {
    if (uiStatus === "cancelado") return "recusado";
    if (uiStatus === "saiu_entrega") return "rota";
    if (uiStatus === "confirmado") return "preparo";
    return uiStatus || "novo";
  }

  async function fetchSupabaseOrdersWithItems() {
    const ordersRaw = await supaFetch(
      `/rest/v1/orders?store_id=eq.${currentStoreId}&select=*,order_items(*)&order=created_at.desc`
    );
    return (ordersRaw || []).map(row => {
      const items = (row.order_items || []).map(it => ({
        id: it.id,
        productId: it.selected_options?.menuItemId || it.product_id || it.product_name,
        menuItemId: it.selected_options?.menuItemId || it.product_id || "",
        name: it.product_name,
        categoryId: it.selected_options?.categoryId || "",
        portion: it.selected_options?.portion || "",
        quantity: Number(it.quantity || 1),
        price: Number(it.unit_price || 0),
        subtotal: Number(it.subtotal || 0),
        notes: it.notes || ""
      }));

      const rawCode = row.code || "";
      const numMatch = String(rawCode).match(/\d+/);
      return {
        _id: row.id,
        id: row.id,
        orderCode: rawCode || ("#" + String(row.id).slice(0, 4).toUpperCase()),
        orderNumber: numMatch ? Number(numMatch[0]) : row.id,
        status: mapOrderStatusFromDb(row.status, row.kitchen_note),
        createdAt: row.created_at,
        totalAmount: Number(row.total || row.subtotal || 0),
        generalNotes: String(row.kitchen_note || "").replace("[CONFIRMADO] ", ""),
        customer: {
          name: row.customer_name || "Cliente",
          whatsapp: row.customer_phone || "",
          modality: row.fulfillment === "pickup" ? "pickup" : "delivery",
          address: row.address || "",
          reference: row.reference || ""
        },
        payment: {
          method: row.payment_method || "pix",
          changeFor: row.change_for ? String(row.change_for) : ""
        },
        items
      };
    });
  }

  async function handleSupabaseApi(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();

    // 1. Catálogo completo via RPC get_delivery_catalog
    if (endpoint.startsWith("/delivery/catalog")) {
      const includeUnavailable = endpoint.includes("all=true");
      try {
        const data = await supaFetch(`/rest/v1/rpc/get_delivery_catalog`, {
          method: "POST",
          body: JSON.stringify({
            p_store_slug: STORE_SLUG,
            p_include_unavailable: includeUnavailable
          })
        });
        if (data && data.storeId) {
          currentStoreId = data.storeId;
        }
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          savePublicAndAdminCache(data);
          return data;
        }
      } catch (err) {
        console.warn("Fallback cache catálogo:", err);
      }

      try {
        const stored = localStorage.getItem("peixaria_mancha_admin_catalog_cache") || localStorage.getItem("peixaria_mancha_catalog_cache");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
            return parsed;
          }
        }
      } catch {}

      try {
        const res = await fetch("../cardapio-delivery/catalog-data.json");
        if (res.ok) {
          const fallback = await res.json();
          if (fallback && Array.isArray(fallback.categories)) {
            fallback.allProducts = fallback.products || fallback.allProducts || fallback.categories.flatMap(c => c.items || []);
            return fallback;
          }
        }
      } catch {}
      return { config: {}, categories: [], allProducts: [] };
    }

    // 2. Checagem rápida de novos pedidos em tempo real
    if (endpoint === "/admin/orders/latest") {
      const rows = await supaFetch(
        `/rest/v1/orders?store_id=eq.${currentStoreId}&select=id,created_at&order=created_at.desc&limit=50`
      );
      return {
        latestId: rows && rows[0] ? rows[0].id : null,
        totalOrders: (rows || []).length
      };
    }

    // 3. Criar Pedido (Cliente ou Botão "+ Gerar Pedido Exemplo")
    if (endpoint === "/delivery/orders" && method === "POST") {
      const payload = JSON.parse(options.body || "{}");
      const created = await supaFetch(`/rest/v1/rpc/create_delivery_order`, {
        method: "POST",
        body: JSON.stringify({
          p_payload: payload,
          p_store_slug: STORE_SLUG
        })
      });
      return { order: created };
    }

    // 4. Dashboard & Relatórios
    if (endpoint.startsWith("/admin/dashboard")) {
      const urlObj = new URL(endpoint, "http://localhost");
      const period = urlObj.searchParams.get("period") || "all";

      const allOrders = await fetchSupabaseOrdersWithItems();
      const now = new Date();

      const filteredOrders = allOrders.filter(o => {
        if (period === "all") return true;
        const d = new Date(o.createdAt);
        if (period === "today") {
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
          );
        }
        const diffDays = (now - d) / (1000 * 60 * 60 * 24);
        if (period === "7d") return diffDays <= 7;
        if (period === "30d") return diffDays <= 30;
        return true;
      });

      const validOrders = filteredOrders.filter(o => o.status !== "cancelado");
      const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      const totalOrders = validOrders.length;
      const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const productStatsMap = {};
      const catStatsMap = {};
      (catalogData.categories || []).forEach(c => {
        catStatsMap[c.id] = { id: c.id, title: c.title, quantity: 0, revenue: 0 };
      });

      validOrders.forEach(o => {
        (o.items || []).forEach(it => {
          const pid = it.productId || it.name;
          if (!productStatsMap[pid]) {
            productStatsMap[pid] = {
              productId: pid,
              name: it.name,
              categoryId: it.categoryId || "outros",
              quantitySold: 0,
              revenue: 0,
              portionsBreakdown: {}
            };
          }
          const qty = Number(it.quantity || 1);
          const rev = Number(it.subtotal || it.price * qty || 0);
          productStatsMap[pid].quantitySold += qty;
          productStatsMap[pid].revenue += rev;
          const pKey = it.portion || "Padrão";
          productStatsMap[pid].portionsBreakdown[pKey] = (productStatsMap[pid].portionsBreakdown[pKey] || 0) + qty;

          // Categoria
          const itemNameNorm = String(it.name || "").trim().toLowerCase();
          const prodMatch = (catalogData.allProducts || []).find(
            p =>
              p.id === pid ||
              p._uuid === pid ||
              p.id === it.menuItemId ||
              p._uuid === it.menuItemId ||
              String(p.name || "").trim().toLowerCase() === itemNameNorm
          );
          let catId = it.categoryId || prodMatch?.categoryId;
          if (!catId || !catStatsMap[catId]) {
            const catMatch = (catalogData.categories || []).find(c =>
              (c.items || []).some(
                p =>
                  p.id === pid ||
                  p._uuid === pid ||
                  String(p.name || "").trim().toLowerCase() === itemNameNorm
              )
            );
            if (catMatch) catId = catMatch.id;
          }
          if (catId && catStatsMap[catId]) {
            catStatsMap[catId].quantity += qty;
            catStatsMap[catId].revenue += rev;
          }
        });
      });

      const topProductsByQty = Object.values(productStatsMap).sort((a, b) => b.quantitySold - a.quantitySold);
      const activeProductsCount = (catalogData.allProducts || []).filter(p => p.isAvailable !== false).length;

      // Vendas últimos 7 dias
      const dailySales = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const dayOrders = allOrders.filter(o => {
          if (o.status === "cancelado") return false;
          const od = new Date(o.createdAt);
          return (
            od.getFullYear() === day.getFullYear() &&
            od.getMonth() === day.getMonth() &&
            od.getDate() === day.getDate()
          );
        });
        dailySales.push({
          label: day.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0)
        });
      }

      return {
        kpis: {
          totalRevenue,
          totalOrders,
          avgTicket,
          canceledCount: filteredOrders.filter(o => o.status === "cancelado").length,
          activeProductsCount,
          totalProductsCount: (catalogData.allProducts || []).length
        },
        byModality: {
          delivery: validOrders.filter(o => o.customer?.modality === "delivery").length,
          pickup: validOrders.filter(o => o.customer?.modality === "pickup").length
        },
        byPayment: {
          pix: validOrders.filter(o => o.payment?.method === "pix").length,
          credit: validOrders.filter(o => o.payment?.method === "credit" || o.payment?.method === "card").length,
          debit: validOrders.filter(o => o.payment?.method === "debit").length,
          cash: validOrders.filter(o => o.payment?.method === "cash").length
        },
        topProductsByQty,
        categoryPerformance: Object.values(catStatsMap),
        dailySales,
        recentOrders: filteredOrders.slice(0, 30)
      };
    }

    // 5. Atualizar Status de Pedido
    if (endpoint.startsWith("/admin/orders/") && endpoint.endsWith("/status") && method === "PATCH") {
      const id = endpoint.replace("/admin/orders/", "").replace("/status", "");
      const payload = JSON.parse(options.body || "{}");
      const dbStatus = mapOrderStatusToDb(payload.status);
      const existingOrder = (dashboardData?.recentOrders || []).find(o => String(o._id || o.id) === String(id));
      const baseNote = String(existingOrder?.generalNotes || "").replace(/^\[CONFIRMADO\]\s*/i, "").trim();
      const updateObj = {
        status: dbStatus,
        kitchen_note: payload.status === "confirmado"
          ? (baseNote ? `[CONFIRMADO] ${baseNote}` : "[CONFIRMADO]")
          : baseNote,
        updated_at: new Date().toISOString()
      };
      if (dbStatus === "concluido") {
        updateObj.completed_at = new Date().toISOString();
      }
      await supaFetch(`/rest/v1/orders?id=eq.${encodeURIComponent(id)}&store_id=eq.${currentStoreId}`, {
        method: "PATCH",
        body: JSON.stringify(updateObj)
      });
      return { success: true };
    }

    // 6. Excluir Pedido
    if (endpoint.startsWith("/admin/orders/") && method === "DELETE") {
      const id = endpoint.replace("/admin/orders/", "");
      await supaFetch(`/rest/v1/orders?id=eq.${encodeURIComponent(id)}&store_id=eq.${currentStoreId}`, {
        method: "DELETE"
      });
      return { success: true };
    }

    // 7. Atualizar Configurações da Loja
    if (endpoint === "/admin/config" && method === "PUT") {
      const payload = JSON.parse(options.body || "{}");
      const mergedConfig = { ...(catalogData.config || {}), ...payload };
      delete mergedConfig.storeId;
      delete mergedConfig.storeSlug;
      delete mergedConfig.storeName;

      const isOpenNow = mergedConfig.manualStatus === "force_open"
        ? true
        : mergedConfig.manualStatus === "force_closed"
        ? false
        : true;

      await supaFetch(`/rest/v1/stores?id=eq.${currentStoreId}`, {
        method: "PATCH",
        body: JSON.stringify({
          tagline: mergedConfig.tagline || "Qualidade que você sente, sabor que você ama!",
          phone: mergedConfig.whatsapp || "5591989379978",
          delivery_time: mergedConfig.estimatedTime || "30-50 min",
          opening_time: `${String(mergedConfig.openHour ?? 7).padStart(2, "0")}:00`,
          closing_time: `${String(mergedConfig.closeHour ?? 14).padStart(2, "0")}:00`,
          is_open: isOpenNow,
          delivery_config: mergedConfig,
          updated_at: new Date().toISOString()
        })
      });

      catalogData.config = { ...(catalogData.config || {}), ...mergedConfig };
      saveWebCatalog();
      return { config: catalogData.config };
    }

    // 8. Alternar Status Rápido (Aberto / Fechado)
    if (endpoint === "/admin/toggle-status" && method === "POST") {
      const payload = JSON.parse(options.body || "{}");
      const current = catalogData.config?.manualStatus || "auto";
      const next = payload.status || (current === "force_open" ? "force_closed" : "force_open");
      const res = await handleSupabaseApi("/admin/config", {
        method: "PUT",
        body: JSON.stringify({ manualStatus: next })
      });
      return { manualStatus: next, config: res.config };
    }

    // 9. CRUD de Produtos no Supabase
    if (endpoint === "/admin/products" && method === "POST") {
      const payload = JSON.parse(options.body || "{}");
      const catObj = (catalogData.categories || []).find(
        c => c.id === payload.categoryId || c._uuid === payload.categoryId
      );
      const categoryUuid = catObj?._uuid || null;
      const categorySlug = catObj?.id || payload.categoryId || "peixes-fritos";
      const prodSlug = payload.id || slugify(payload.name, "prato") + "-" + Date.now().toString().slice(-4);
      const basePrice = payload.unitType === "PORÇÃO"
        ? Number(payload.price500ml || payload.price250ml || payload.price || 0)
        : Number(payload.price || 0);

      const insertRow = {
        store_id: currentStoreId,
        category_id: categoryUuid,
        slug: prodSlug,
        name: payload.name,
        badge: payload.badge || "",
        description: payload.description || "",
        price: Math.max(basePrice, 0),
        image_url: payload.image || "",
        is_available: payload.isAvailable !== false,
        sort_order: Number(payload.order || ((catalogData.allProducts || []).length + 1)),
        options_config: {
          unitType: payload.unitType || "KG",
          allowWeightChoice: Boolean(payload.allowWeightChoice),
          isPopular: Boolean(payload.isPopular),
          serves: payload.serves || "",
          price250ml: payload.price250ml !== undefined && payload.price250ml !== null && payload.price250ml !== "" ? Number(payload.price250ml) : null,
          price500ml: payload.price500ml !== undefined && payload.price500ml !== null && payload.price500ml !== "" ? Number(payload.price500ml) : null,
          categorySlug
        }
      };

      const created = await supaFetch(`/rest/v1/products`, {
        method: "POST",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(insertRow)
      });
      return { product: created?.[0] || insertRow };
    }

    if (endpoint.startsWith("/admin/products/") && method === "PUT") {
      const id = decodeURIComponent(endpoint.replace("/admin/products/", ""));
      const payload = JSON.parse(options.body || "{}");
      const existing = (catalogData.allProducts || []).find(p => p.id === id || p._uuid === id);
      if (!existing) throw new Error("Produto não encontrado.");

      const merged = { ...existing, ...payload };
      const catObj = (catalogData.categories || []).find(
        c => c.id === merged.categoryId || c._uuid === merged.categoryId
      );
      const categoryUuid = catObj?._uuid || existing.categoryUuid || null;
      const categorySlug = catObj?.id || merged.categoryId || "peixes-fritos";
      const basePrice = merged.unitType === "PORÇÃO"
        ? Number(merged.price500ml || merged.price250ml || merged.price || 0)
        : Number(merged.price || 0);

      const updateRow = {
        category_id: categoryUuid,
        name: merged.name,
        badge: merged.badge || "",
        description: merged.description || "",
        price: Math.max(basePrice, 0),
        image_url: merged.image || "",
        is_available: merged.isAvailable !== false,
        sort_order: Number(merged.order || 1),
        options_config: {
          unitType: merged.unitType || "KG",
          allowWeightChoice: Boolean(merged.allowWeightChoice),
          isPopular: Boolean(merged.isPopular),
          serves: merged.serves || "",
          price250ml: merged.price250ml !== undefined && merged.price250ml !== null && merged.price250ml !== "" ? Number(merged.price250ml) : null,
          price500ml: merged.price500ml !== undefined && merged.price500ml !== null && merged.price500ml !== "" ? Number(merged.price500ml) : null,
          categorySlug
        },
        updated_at: new Date().toISOString()
      };

      const filterQuery = existing._uuid
        ? `id=eq.${existing._uuid}`
        : `store_id=eq.${currentStoreId}&slug=eq.${encodeURIComponent(id)}`;

      let updated = await supaFetch(`/rest/v1/products?${filterQuery}`, {
        method: "PATCH",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(updateRow)
      });

      if ((!Array.isArray(updated) || updated.length === 0) && existing._uuid) {
        updated = await supaFetch(`/rest/v1/products?store_id=eq.${currentStoreId}&slug=eq.${encodeURIComponent(existing.id || id)}`, {
          method: "PATCH",
          headers: { "Prefer": "return=representation" },
          body: JSON.stringify(updateRow)
        });
      }

      if (!Array.isArray(updated) || updated.length === 0) {
        throw new Error("Não foi possível atualizar o produto no banco. Recarregue a página ou faça login novamente.");
      }

      return { product: merged };
    }

    if (endpoint.startsWith("/admin/products/") && method === "DELETE") {
      const id = decodeURIComponent(endpoint.replace("/admin/products/", ""));
      const existing = (catalogData.allProducts || []).find(p => p.id === id || p._uuid === id);
      const filterQuery = existing?._uuid
        ? `id=eq.${existing._uuid}`
        : `store_id=eq.${currentStoreId}&slug=eq.${encodeURIComponent(id)}`;

      await supaFetch(`/rest/v1/products?${filterQuery}`, {
        method: "DELETE"
      });
      return { success: true };
    }

    // 10. CRUD de Categorias no Supabase
    if (endpoint === "/admin/categories" && method === "POST") {
      const payload = JSON.parse(options.body || "{}");
      const catSlug = payload.id || slugify(payload.title, "categoria");
      const insertRow = {
        store_id: currentStoreId,
        slug: catSlug,
        name: payload.title,
        subtitle: payload.subtitle || "",
        display_type: payload.type || "single",
        icon: payload.iconName || "Fish",
        sort_order: Number(payload.order || ((catalogData.categories || []).length + 1)),
        is_active: true
      };
      const created = await supaFetch(`/rest/v1/categories`, {
        method: "POST",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(insertRow)
      });
      return { category: created?.[0] || insertRow };
    }

    if (endpoint.startsWith("/admin/categories/") && method === "PUT") {
      const id = decodeURIComponent(endpoint.replace("/admin/categories/", ""));
      const payload = JSON.parse(options.body || "{}");
      const existing = (catalogData.categories || []).find(c => c.id === id || c._uuid === id);
      if (!existing) throw new Error("Categoria não encontrada.");

      const updateRow = {
        name: payload.title ?? existing.title,
        subtitle: payload.subtitle ?? existing.subtitle ?? "",
        display_type: payload.type ?? existing.type ?? "single",
        sort_order: Number(payload.order ?? existing.order ?? 1)
      };

      const filterQuery = existing._uuid
        ? `id=eq.${existing._uuid}`
        : `store_id=eq.${currentStoreId}&slug=eq.${encodeURIComponent(id)}`;

      await supaFetch(`/rest/v1/categories?${filterQuery}`, {
        method: "PATCH",
        body: JSON.stringify(updateRow)
      });
      return { category: { ...existing, ...payload } };
    }

    if (endpoint.startsWith("/admin/categories/") && method === "DELETE") {
      const id = decodeURIComponent(endpoint.replace("/admin/categories/", ""));
      const existing = (catalogData.categories || []).find(c => c.id === id || c._uuid === id);
      const filterQuery = existing?._uuid
        ? `id=eq.${existing._uuid}`
        : `store_id=eq.${currentStoreId}&slug=eq.${encodeURIComponent(id)}`;

      await supaFetch(`/rest/v1/categories?${filterQuery}`, {
        method: "DELETE"
      });
      return { success: true };
    }

    // 11. Backup
    if (endpoint === "/admin/backup") {
      const orders = await fetchSupabaseOrdersWithItems();
      return {
        config: catalogData.config,
        categories: catalogData.categories,
        products: catalogData.allProducts,
        orders
      };
    }

    if (endpoint === "/admin/restore" && method === "POST") {
      const payload = JSON.parse(options.body || "{}");
      let backupToRestore = payload.backupData || null;
      if (payload.resetFactory || !backupToRestore) {
        const res = await fetch("../cardapio-delivery/catalog-data.json");
        if (!res.ok) throw new Error("Não foi possível carregar o catálogo padrão de fábrica.");
        backupToRestore = await res.json();
      }
      const rpcRes = await supaFetch(`/rest/v1/rpc/restore_delivery_catalog`, {
        method: "POST",
        body: JSON.stringify({
          p_store_slug: STORE_SLUG,
          p_backup: backupToRestore
        })
      });
      return { message: rpcRes?.message || "Dados sincronizados com o Supabase Nuvem!" };
    }

    // 12. Atualizar Credenciais no Supabase Auth
    if (endpoint === "/auth/credentials" && method === "PUT") {
      const payload = JSON.parse(options.body || "{}");
      const updateBody = {};
      if (payload.newEmail) updateBody.email = payload.newEmail;
      if (payload.newPassword) updateBody.password = payload.newPassword;

      await supaFetch(`/auth/v1/user`, {
        method: "PUT",
        body: JSON.stringify(updateBody)
      });
      return { message: "Credenciais atualizadas no Supabase Auth com sucesso!" };
    }

    return {};
  }

  // ==========================================================================
  // AUTENTICAÇÃO E SESSÃO (100% SUPABASE AUTH)
  // ==========================================================================

  function updateDbBadge() {
    if (dbStatusBadge) {
      dbStatusBadge.textContent = "Supabase Nuvem (Online)";
      dbStatusBadge.className = "text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full";
    }
  }

  async function checkSession() {
    if (!authToken) {
      showLoginScreen();
      return;
    }

    try {
      let verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (verifyRes.status === 401) {
        const refreshed = await tryRefreshSupabaseToken();
        if (refreshed) {
          verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
              "apikey": SUPABASE_ANON_KEY,
              "Authorization": `Bearer ${authToken}`
            }
          });
        }
      }

      if (verifyRes.ok) {
        const supaUser = await verifyRes.json();
        if (supaUser && supaUser.email) {
          updateDbBadge();
          const credEmail = document.getElementById("cred-email");
          if (credEmail) credEmail.value = supaUser.email;
          showAdminApp();
          await loadAllData();
          return;
        }
      }
    } catch (e) {
      console.warn("Erro ao verificar sessão Supabase:", e);
    }

    authToken = null;
    localStorage.removeItem("mancha_admin_token");
    localStorage.removeItem("mancha_admin_refresh_token");
    localStorage.removeItem("mancha_auth_provider");
    showLoginScreen();
  }

  function showLoginScreen() {
    loginScreen.classList.remove("hidden");
    adminApp.classList.add("hidden");
    refreshIcons();
  }

  // ==========================================================================
  // NOTIFICAÇÃO EM TEMPO REAL & ATUALIZAÇÃO AO VIVO
  // ==========================================================================

  let lastKnownLatestId = null;
  let lastKnownOrderCount = null;
  let sseSource = null;
  let livePollInterval = null;

  function playOrderAlertSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Primeiro tom (D5 - 587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Segundo tom (A5 - 880 Hz) - agradável "Ding-Dong" de chamada
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch {}
  }

  function handleIncomingNewOrder(order) {
    playOrderAlertSound();
    const clientName = order?.customer?.name || "Cliente";
    const totalFormatted = formatBRL(order?.totalAmount || 0);
    const code = order?.orderCode || ("#" + (order?.orderNumber || ""));

    showToast(`🔔 NOVO PEDIDO RECEBIDO! ${code} • ${clientName} (${totalFormatted})`);

    // Efeito pulsante no badge da aba Pedidos
    const navBadge = document.getElementById("nav-orders-badge");
    if (navBadge) {
      navBadge.classList.add("animate-bounce", "ring-4", "ring-emerald-400");
      setTimeout(() => navBadge.classList.remove("animate-bounce", "ring-4", "ring-emerald-400"), 4000);
    }

    // Atualiza os dados imediatamente na tela ao vivo
    loadDashboard(currentPeriod);
  }

  function startLiveOrdersWatcher() {
    // Polling em tempo real direto no Supabase a cada 4 segundos
    if (livePollInterval) clearInterval(livePollInterval);
    livePollInterval = setInterval(async () => {
      if (!authToken) return;
      try {
        const check = await apiFetch("/admin/orders/latest");
        if (lastKnownLatestId === null && lastKnownOrderCount === null) {
          lastKnownLatestId = check.latestId;
          lastKnownOrderCount = check.totalOrders;
          return;
        }

        if (check.latestId && check.latestId !== lastKnownLatestId) {
          lastKnownLatestId = check.latestId;
          lastKnownOrderCount = check.totalOrders;
          await Promise.all([
            loadDashboard(currentPeriod),
            loadCustomers()
          ]);
          playOrderAlertSound();
          showToast(`🔔 NOVO PEDIDO RECEBIDO NO SUPABASE! Atualizado ao vivo.`);
        } else {
          lastKnownOrderCount = check.totalOrders;
        }
      } catch {}
    }, 4000);
  }

  function showAdminApp() {
    loginScreen.classList.add("hidden");
    adminApp.classList.remove("hidden");
    refreshIcons();
    startLiveOrdersWatcher();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.add("hidden");
    const rawEmail = document.getElementById("login-email").value.trim();
    const email = rawEmail.toLowerCase() === "admin@peixariamancha.com.br"
      ? "culinariamancha@gmail.com"
      : rawEmail;
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-submit-btn");
    btn.disabled = true;
    btn.textContent = "Autenticando no Supabase...";

    try {
      let supaRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
      });

      if (!supaRes.ok && rawEmail.toLowerCase() !== email.toLowerCase()) {
        supaRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ email: rawEmail, password })
        });
      }

      if (supaRes.ok) {
        const supaData = await supaRes.json();
        authToken = supaData.access_token;
        refreshToken = supaData.refresh_token || null;
        const userEmail = supaData.user?.email || email;

        localStorage.setItem("mancha_admin_token", authToken);
        if (refreshToken) {
          localStorage.setItem("mancha_admin_refresh_token", refreshToken);
        }
        localStorage.setItem("mancha_auth_provider", "supabase");
        localStorage.setItem("mancha_admin_email", userEmail);

        updateDbBadge();
        const credEmail = document.getElementById("cred-email");
        if (credEmail) credEmail.value = userEmail;
        showAdminApp();
        await loadAllData();
        showToast("Conectado ao Supabase Nuvem • Peixaria Mancha!");
      } else {
        loginError.textContent = "E-mail ou senha incorretos no Supabase Auth.";
        loginError.classList.remove("hidden");
      }
    } catch (err) {
      loginError.textContent = "Erro de conexão com o Supabase. Verifique sua internet.";
      loginError.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar no Painel";
    }
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (sseSource) sseSource.close();
      if (livePollInterval) clearInterval(livePollInterval);
      authToken = null;
      refreshToken = null;
      localStorage.removeItem("mancha_admin_token");
      localStorage.removeItem("mancha_admin_refresh_token");
      localStorage.removeItem("mancha_auth_provider");
      localStorage.removeItem("mancha_admin_email");
      localStorage.removeItem("mancha_is_web_mode");
      showLoginScreen();
    });
  }

  const refreshAllBtn = document.getElementById("refresh-all-btn");
  if (refreshAllBtn) {
    refreshAllBtn.addEventListener("click", async () => {
      await loadAllData();
      showToast("Dados atualizados com sucesso!");
    });
  }

  // ==========================================================================
  // NAVEGAÇÃO DE ABAS COM ESTILO ATIVO
  // ==========================================================================

  const tabTitles = {
    dashboard: { title: "Dashboard", sub: "Acompanhe métricas, ranking de peixes e volume de pedidos." },
    products: { title: "Produtos & Preços", sub: "Adicione pratos, altere valores, pause itens do dia ou troque fotos." },
    orders: { title: "Pedidos Recebidos", sub: "Todos os pedidos gerados pelos clientes aparecem aqui automaticamente." },
    customers: { title: "Clientes Cadastrados", sub: "Veja todos os clientes registrados pelo cardápio digital e delivery." },
    categories: { title: "Categorias do Cardápio", sub: "Organize as seções do cardápio digital (Peixes Fritos, Assados, Porções)." },
    settings: { title: "Configurações da Loja & Horários", sub: "Controle o funcionamento do Delivery, horários de atendimento, WhatsApp e credenciais." }
  };

  function switchTab(target) {
    document.querySelectorAll(".tab-btn").forEach(b => {
      if (b.getAttribute("data-tab") === target) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    document.querySelectorAll(".tab-panel").forEach(panel => {
      if (panel.id === `tab-${target}`) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });

    if (tabTitles[target]) {
      if (viewTitle) viewTitle.textContent = tabTitles[target].title;
      if (viewSubtitle) viewSubtitle.textContent = tabTitles[target].sub;
    }

    if (periodWrapper) {
      if (target === "dashboard") {
        periodWrapper.classList.remove("hidden");
        periodWrapper.classList.add("flex");
      } else {
        periodWrapper.classList.add("hidden");
        periodWrapper.classList.remove("flex");
      }
    }

    refreshIcons();
  }

  // Controle do Menu Lateral no Mobile (Três Riscos / Drawer)
  const sidebar = document.getElementById("admin-sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileSidebarClose = document.getElementById("mobile-sidebar-close");

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.remove("-translate-x-full");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("hidden");
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.add("-translate-x-full");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("hidden");
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileSidebar);
  if (mobileSidebarClose) mobileSidebarClose.addEventListener("click", closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeMobileSidebar);

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchTab(target);
      closeMobileSidebar();
    });
  });

  document.querySelectorAll("[data-tab-switch]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-switch");
      switchTab(target);
      closeMobileSidebar();
    });
  });

  // Botão rápido "+ Novo Produto" no topo
  const quickNewProd = document.getElementById("new-product-quick-btn");
  if (quickNewProd) {
    quickNewProd.addEventListener("click", () => openProductModal(null));
  }

  // ==========================================================================
  // CARREGAMENTO CENTRAL DE DADOS
  // ==========================================================================

  let customersData = [];

  async function loadAllData() {
    await loadCatalog();
    await Promise.all([
      loadDashboard(currentPeriod),
      loadCustomers()
    ]);
  }

  async function loadCustomers() {
    try {
      const rows = await supaFetch(
        `/rest/v1/store_customers?store_id=eq.${currentStoreId}&select=*&order=updated_at.desc`
      );
      customersData = Array.isArray(rows) ? rows : [];
      const badge = document.getElementById("nav-customers-badge");
      if (badge) badge.textContent = customersData.length;
      renderCustomersTab();
    } catch (err) {
      console.warn("Erro ao carregar clientes:", err);
    }
  }

  function renderCustomersTab() {
    const listEl = document.getElementById("admin-customers-list");
    if (!listEl) return;

    const search = (document.getElementById("admin-customer-search")?.value || "").toLowerCase().trim();
    const filtered = customersData.filter(c => {
      if (!search) return true;
      return (
        String(c.name || "").toLowerCase().includes(search) ||
        String(c.phone || "").toLowerCase().includes(search) ||
        String(c.email || "").toLowerCase().includes(search) ||
        String(c.neighborhood_id || "").toLowerCase().includes(search) ||
        String(c.street || "").toLowerCase().includes(search)
      );
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-xs">Nenhum cliente cadastrado encontrado.</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(c => {
      const cleanPhone = String(c.phone_digits || c.phone || "").replace(/\D/g, "");
      const waLink = cleanPhone ? `https://wa.me/55${cleanPhone.replace(/^55/, "")}` : "#";
      const addrParts = [c.street, c.number, c.neighborhood_id].filter(Boolean).join(", ");
      const dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "";

      return `
        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h4 class="font-bold text-sm text-[#072a29] truncate">${c.name || "Cliente"}</h4>
              <p class="text-xs font-semibold text-emerald-700 mt-0.5">${c.phone || "Sem WhatsApp"}</p>
              ${c.email ? `<p class="text-[11px] text-slate-500 truncate">${c.email}</p>` : ""}
            </div>
            <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">${dateStr}</span>
          </div>

          <div class="text-xs text-slate-600 bg-[#f8faf9] rounded-xl p-2.5 border border-slate-100 space-y-0.5">
            <p><strong>Endereço:</strong> ${addrParts || "Não informado"}</p>
            ${c.reference ? `<p><strong>Ref.:</strong> ${c.reference}</p>` : ""}
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
                WhatsApp
              </a>
            ` : ""}
            <button type="button" data-del-customer="${c.id}" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Remover cliente">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll("[data-del-customer]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-customer");
        if (!confirm("Remover este cliente do cadastro?")) return;
        try {
          await supaFetch(`/rest/v1/store_customers?id=eq.${encodeURIComponent(id)}&store_id=eq.${currentStoreId}`, {
            method: "DELETE"
          });
          await loadCustomers();
          showToast("Cliente removido com sucesso.");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  const customerSearchInput = document.getElementById("admin-customer-search");
  if (customerSearchInput) {
    customerSearchInput.addEventListener("input", renderCustomersTab);
  }

  async function loadCatalog() {
    const data = await apiFetch("/delivery/catalog?all=true");
    catalogData = data;
    updateDbBadge();
    populateCategorySelectors();
    renderProductsTab();
    renderCategoriesTab();
    populateSettingsForm(data.config || {});

    if (dashboardData && dashboardData.kpis) {
      dashboardData.kpis.activeProductsCount = (catalogData.allProducts || []).filter(p => p.isAvailable !== false).length;
      dashboardData.kpis.totalProductsCount = (catalogData.allProducts || []).length;
      renderDashboard();
    }

    savePublicAndAdminCache(data);
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
        b.classList.remove("bg-[#072a29]", "text-white", "font-bold");
        b.classList.add("text-slate-500", "font-semibold");
      });
      btn.classList.add("bg-[#072a29]", "text-white", "font-bold");
      btn.classList.remove("text-slate-500", "font-semibold");
      loadDashboard(btn.getAttribute("data-period"));
    });
  });

  // ==========================================================================
  // RENDERIZAR ABA 1: DASHBOARD & RANKING (DESIGN DO MODELO)
  // ==========================================================================

  function renderDashboard() {
    if (!dashboardData) return;
    const { kpis, byModality, byPayment, topProductsByQty, categoryPerformance, dailySales, recentOrders } = dashboardData;

    // Atualizar KPIs Superiores
    const revEl = document.getElementById("kpi-revenue");
    if (revEl) revEl.textContent = formatBRL(kpis.totalRevenue);

    const ordEl = document.getElementById("kpi-orders");
    if (ordEl) ordEl.textContent = kpis.totalOrders;

    const modSplit = document.getElementById("kpi-modality-split");
    if (modSplit) modSplit.textContent = `${byModality.delivery || 0} Entrega • ${byModality.pickup || 0} Retirada`;

    const ticketEl = document.getElementById("kpi-ticket");
    if (ticketEl) ticketEl.textContent = formatBRL(kpis.avgTicket);

    const activeProdEl = document.getElementById("kpi-active-products");
    if (activeProdEl) activeProdEl.textContent = `${kpis.activeProductsCount} / ${kpis.totalProductsCount}`;

    const badgeOrders = document.getElementById("nav-orders-badge");
    if (badgeOrders) badgeOrders.textContent = recentOrders.length;

    // Ajustar Gauge Semi-circular SVG (de 180° à esquerda até 0° à direita)
    const totalCount = Math.max(kpis.totalProductsCount, 1);
    const activePct = Math.round((kpis.activeProductsCount / totalCount) * 100);
    const gaugeArc = document.getElementById("gauge-arc");
    const gaugeDot = document.getElementById("gauge-dot");
    if (gaugeArc) {
      if (activePct <= 0) {
        gaugeArc.setAttribute("d", "M 10 50 A 40 40 0 0 1 10 50");
        if (gaugeDot) {
          gaugeDot.setAttribute("cx", "10");
          gaugeDot.setAttribute("cy", "50");
        }
      } else {
        const clampedPct = Math.min(activePct, 99.9);
        const angle = Math.PI - (clampedPct / 100) * Math.PI;
        const x = 50 + 40 * Math.cos(angle);
        const y = 50 - 40 * Math.sin(angle);
        gaugeArc.setAttribute("d", `M 10 50 A 40 40 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`);
        if (gaugeDot) {
          gaugeDot.setAttribute("cx", x.toFixed(1));
          gaugeDot.setAttribute("cy", y.toFixed(1));
        }
      }
    }

    // 2. Mix de Categorias (Card central com bolinhas)
    const catStatsEl = document.getElementById("category-stats-list");
    const totalCatQty = categoryPerformance.reduce((s, c) => s + c.quantity, 0);
    const totalCatRev = Math.max(totalCatQty, 1);
    const colors = ["bg-emerald-500", "bg-teal-500", "bg-amber-500", "bg-rose-500", "bg-sky-500"];

    if (catStatsEl) {
      if (categoryPerformance.length === 0) {
        catStatsEl.innerHTML = `<span class="text-slate-400 text-xs">Sem categorias registradas.</span>`;
      } else {
        catStatsEl.innerHTML = categoryPerformance.map((cat, idx) => {
          const pct = totalCatQty > 0 ? (Math.round((cat.quantity / totalCatRev) * 100) || 0) : 0;
          const dotColor = colors[idx % colors.length];
          return `
            <div class="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
              <span class="flex items-center gap-2 text-slate-700 font-semibold truncate max-w-[170px]">
                <span class="w-2 h-2 rounded-full ${dotColor} flex-shrink-0"></span>
                <span class="truncate">${cat.title}</span>
              </span>
              <span class="font-bold text-[#072a29] text-xs">${pct}%</span>
            </div>
          `;
        }).join("");
      }
    }

    const highlightMix = document.getElementById("mix-highlight-pct");
    if (highlightMix) {
      highlightMix.textContent = totalCatQty > 0 ? "100%" : "0%";
    }

    // 3. Top Produtos Mais Vendidos (com estética clean)
    const topContainer = document.getElementById("top-products-list");
    if (topContainer) {
      if (!topProductsByQty || topProductsByQty.length === 0) {
        topContainer.innerHTML = `
          <div class="text-center py-10 px-4 rounded-2xl bg-[#f8faf9] border border-dashed border-slate-200">
            <p class="font-bold text-xs text-slate-600">Ainda não há vendas registradas neste período</p>
            <p class="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">Assim que os clientes fizerem pedidos (ou se clicar em "+ Gerar Pedido Exemplo"), o ranking dos pratos mais vendidos aparecerá aqui.</p>
          </div>
        `;
      } else {
        const maxQty = Math.max(...topProductsByQty.map(p => p.quantitySold), 1);
        topContainer.innerHTML = topProductsByQty.slice(0, 8).map((item, idx) => {
          const pct = Math.round((item.quantitySold / maxQty) * 100);
          const medalBadge = idx === 0
            ? "bg-amber-400 text-[#072a29] font-black"
            : idx === 1
            ? "bg-slate-300 text-[#072a29] font-black"
            : idx === 2
            ? "bg-amber-700 text-white font-bold"
            : "bg-slate-100 text-slate-600 font-bold";

          const portionsText = Object.entries(item.portionsBreakdown || {})
            .map(([p, q]) => `${q}x ${p}`)
            .join(" • ");

          return `
            <div class="p-3 rounded-2xl bg-[#f8faf9] border border-slate-200/80 hover:border-emerald-500/40 transition-all">
              <div class="flex items-center justify-between gap-3 mb-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-full text-[10px] flex items-center justify-center flex-shrink-0 ${medalBadge}">
                    ${idx + 1}º
                  </span>
                  <div class="min-w-0">
                    <h4 class="font-bold text-xs text-[#072a29] truncate">${item.name}</h4>
                    <p class="text-[10px] text-slate-400 truncate">${portionsText || "Porção padrão"}</p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <span class="font-extrabold text-xs text-[#072a29] block">${item.quantitySold} un.</span>
                  <span class="text-[10px] font-bold text-emerald-600">${formatBRL(item.revenue)}</span>
                </div>
              </div>
              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    // 4. Formas de Pagamento
    const payContainer = document.getElementById("payment-stats-list");
    if (payContainer) {
      const payLabels = {
        pix: { label: "PIX", color: "text-emerald-600", bg: "bg-emerald-50" },
        credit: { label: "Crédito", color: "text-blue-600", bg: "bg-blue-50" },
        debit: { label: "Débito", color: "text-teal-600", bg: "bg-teal-50" },
        cash: { label: "Dinheiro", color: "text-amber-600", bg: "bg-amber-50" }
      };
      payContainer.innerHTML = Object.entries(payLabels).map(([key, info]) => `
        <div class="p-2.5 rounded-xl ${info.bg} border border-slate-100 flex items-center justify-between">
          <span class="font-bold text-slate-600 text-[11px]">${info.label}</span>
          <span class="font-black text-xs ${info.color}">${byPayment[key] || 0}</span>
        </div>
      `).join("");
    }

    // 5. Histórico 7 Dias
    const dailyContainer = document.getElementById("daily-sales-list");
    if (dailyContainer) {
      dailyContainer.innerHTML = (dailySales || []).map(d => `
        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
          <span class="text-slate-600 font-medium capitalize text-[11px]">${d.label}</span>
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-[10px]">${d.orders} ped.</span>
            <span class="font-bold text-emerald-700 text-xs w-16 text-right">${formatBRL(d.revenue)}</span>
          </div>
        </div>
      `).join("");
    }

    refreshIcons();
  }

  // Botão para gerar pedido de exemplo
  const simOrderBtn = document.getElementById("simulate-order-btn");
  if (simOrderBtn) {
    simOrderBtn.addEventListener("click", async () => {
      try {
        const sampleOrder = {
          customer: {
            name: "Cliente Teste Delivery",
            whatsapp: "(91) 98888-7777",
            modality: "delivery",
            address: "Av. Augusto Montenegro, Belém - PA",
            reference: "Próximo à Peixaria"
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
          generalNotes: "Pedido de exemplo para demonstração do Dashboard."
        };

        await apiFetch("/delivery/orders", {
          method: "POST",
          body: JSON.stringify(sampleOrder)
        });
        await loadDashboard(currentPeriod);
        showToast("Pedido de exemplo registrado no Dashboard!");
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // ==========================================================================
  // RENDERIZAR ABA 2: PRODUTOS & EDIÇÃO
  // ==========================================================================

  function populateCategorySelectors() {
    const filterSelect = document.getElementById("admin-product-cat-filter");
    const modalSelect = document.getElementById("prod-categoryId");
    if (!filterSelect || !modalSelect) return;

    const currentFilter = filterSelect.value || "all";
    const cats = catalogData.categories || [];

    filterSelect.innerHTML = `<option value="all">Todas as Categorias (${cats.length})</option>` +
      cats.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
    filterSelect.value = currentFilter;

    modalSelect.innerHTML = cats.map(c => `<option value="${c.id}">${c.title}</option>`).join("");
  }

  function renderProductsTab() {
    const grid = document.getElementById("admin-products-grid");
    if (!grid) return;

    const searchInput = document.getElementById("admin-product-search");
    const search = (searchInput?.value || "").toLowerCase().trim();
    const catFilter = document.getElementById("admin-product-cat-filter")?.value || "all";

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
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-xs">Nenhum prato encontrado para este filtro.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const available = prod.isAvailable !== false;
      const priceText = prod.unitType === "PORÇÃO"
        ? `${prod.price250ml ? `250g: ${formatBRL(prod.price250ml)} • ` : ""}500g: ${formatBRL(prod.price500ml || prod.price)}`
        : `${formatBRL(prod.price)} / ${prod.unitType || "UN"}`;

      return `
        <div class="p-4 rounded-2xl bg-white border ${available ? "border-slate-200" : "opacity-60 border-red-200 bg-red-50/20"} shadow-xs flex flex-col justify-between gap-3 transition-all">
          <div class="flex items-start gap-3">
            ${prod.image ? `
              <img src="${prod.image}" alt="${prod.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0 bg-slate-100">
            ` : `
              <div class="w-16 h-16 rounded-xl bg-[#f0f5f3] border border-slate-200 flex items-center justify-center flex-shrink-0 text-emerald-800 font-bold text-xs">
                ${prod.unitType || "PEIXE"}
              </div>
            `}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[9px] font-bold uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  ${catsMap[prod.categoryId] || prod.categoryId}
                </span>
                ${prod.badge ? `<span class="text-[9px] font-bold uppercase text-white bg-red-600 px-2 py-0.5 rounded-md">${prod.badge}</span>` : ""}
                ${prod.isPopular ? `<span class="text-[9px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">★ Destaque</span>` : ""}
              </div>
              <h4 class="font-bold text-xs sm:text-sm text-[#072a29] mt-1 leading-snug">${prod.name}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${prod.description || "Sem descrição cadastrada"}</p>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-[9px] uppercase font-bold text-slate-400 block">Preço</span>
              <span class="font-extrabold text-base text-emerald-700">${priceText}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button type="button" data-toggle-avail="${prod.id}"
                class="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  available
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                }">
                ${available ? "● Ativo" : "○ Pausado"}
              </button>

              <button type="button" data-edit-prod="${prod.id}"
                class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                Editar
              </button>

              <button type="button" data-del-prod="${prod.id}" title="Excluir"
                class="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Ações dos botões da lista de produtos
    grid.querySelectorAll("[data-toggle-avail]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (btn.disabled) return;
        const id = btn.getAttribute("data-toggle-avail");
        const prod = catalogData.allProducts.find(p => p.id === id);
        if (!prod) return;
        btn.disabled = true;
        try {
          const nextAvail = prod.isAvailable === false;
          await apiFetch(`/admin/products/${id}`, {
            method: "PUT",
            body: JSON.stringify({ isAvailable: nextAvail })
          });
          await loadCatalog();
          await loadDashboard(currentPeriod);
          broadcastSync();
          showToast(`"${prod.name}" ${nextAvail ? "ativado" : "pausado"} no cardápio!`);
        } catch (err) {
          showToast(err.message, true);
        } finally {
          btn.disabled = false;
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
        if (!confirm("Tem certeza que deseja excluir este prato?")) return;
        try {
          await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
          await loadCatalog();
          await loadDashboard(currentPeriod);
          broadcastSync();
          showToast("Prato excluído com sucesso.");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  const searchInput = document.getElementById("admin-product-search");
  if (searchInput) searchInput.addEventListener("input", renderProductsTab);

  const catFilterSelect = document.getElementById("admin-product-cat-filter");
  if (catFilterSelect) catFilterSelect.addEventListener("change", renderProductsTab);

  // Modal de Produto
  const productModal = document.getElementById("product-modal");
  const productForm = document.getElementById("product-form");
  const DEFAULT_UNIT_TYPES = [
    { value: "KG", label: "Por Quilo (KG)" },
    { value: "BANDA", label: "Banda de Peixe" },
    { value: "UNIDADE", label: "Unidade" },
    { value: "PORÇÃO", label: "Porção (250g / 500g)" }
  ];

  function populateUnitTypeSelect(selectedValue = "KG") {
    const select = document.getElementById("prod-unitType");
    if (!select) return;

    const customList = Array.isArray(catalogData.config?.customUnitTypes)
      ? catalogData.config.customUnitTypes
      : [];
    const seen = new Set();
    const options = [];

    DEFAULT_UNIT_TYPES.forEach(u => {
      seen.add(u.value);
      options.push(u);
    });

    customList.forEach(u => {
      const val = String(u || "").trim().toUpperCase();
      if (val && !seen.has(val)) {
        seen.add(val);
        options.push({ value: val, label: val });
      }
    });

    const currentVal = String(selectedValue || "KG").trim().toUpperCase();
    if (currentVal && !seen.has(currentVal)) {
      seen.add(currentVal);
      options.push({ value: currentVal, label: currentVal });
    }

    select.innerHTML = options
      .map(o => `<option value="${o.value}">${o.label}</option>`)
      .join("");
    select.value = currentVal || "KG";
  }

  const addUnitTypeBtn = document.getElementById("add-unit-type-btn");
  const newUnitTypeBox = document.getElementById("new-unit-type-box");
  const newUnitTypeInput = document.getElementById("new-unit-type-input");
  const saveUnitTypeBtn = document.getElementById("save-unit-type-btn");

  async function handleSaveNewUnitType() {
    const raw = (newUnitTypeInput?.value || "").trim().toUpperCase();
    if (!raw) {
      showToast("Digite o nome do novo tipo de unidade.", true);
      return;
    }

    const existingCustom = Array.isArray(catalogData.config?.customUnitTypes)
      ? [...catalogData.config.customUnitTypes]
      : [];
    const isDefault = DEFAULT_UNIT_TYPES.some(u => u.value === raw);
    if (!isDefault && !existingCustom.includes(raw)) {
      existingCustom.push(raw);
      try {
        await apiFetch("/admin/config", {
          method: "PUT",
          body: JSON.stringify({ customUnitTypes: existingCustom })
        });
      } catch (err) {
        // Mesmo se falhar rede, mantém na sessão atual
        catalogData.config = { ...(catalogData.config || {}), customUnitTypes: existingCustom };
      }
    }

    populateUnitTypeSelect(raw);
    if (newUnitTypeInput) newUnitTypeInput.value = "";
    if (newUnitTypeBox) newUnitTypeBox.classList.add("hidden");
    showToast(`Tipo "${raw}" adicionado!`);
  }

  if (addUnitTypeBtn && newUnitTypeBox) {
    addUnitTypeBtn.addEventListener("click", () => {
      newUnitTypeBox.classList.toggle("hidden");
      if (!newUnitTypeBox.classList.contains("hidden") && newUnitTypeInput) {
        newUnitTypeInput.focus();
      }
    });
  }

  if (saveUnitTypeBtn) {
    saveUnitTypeBtn.addEventListener("click", handleSaveNewUnitType);
  }

  if (newUnitTypeInput) {
    newUnitTypeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSaveNewUnitType();
      }
    });
  }

  function openProductModal(prod = null) {
    const isEdit = Boolean(prod);
    document.getElementById("prod-is-edit").value = isEdit ? "true" : "false";
    document.getElementById("product-modal-title").textContent = isEdit ? "Editar Prato" : "Cadastrar Novo Prato";
    document.getElementById("prod-id").value = prod ? prod.id : "";
    document.getElementById("prod-name").value = prod ? prod.name : "";
    document.getElementById("prod-categoryId").value = prod ? prod.categoryId : (catalogData.categories[0]?.id || "");
    document.getElementById("prod-description").value = prod ? (prod.description || "") : "";
    populateUnitTypeSelect(prod ? (prod.unitType || "KG") : "KG");
    if (newUnitTypeBox) newUnitTypeBox.classList.add("hidden");
    if (newUnitTypeInput) newUnitTypeInput.value = "";
    document.getElementById("prod-badge").value = prod ? (prod.badge || "") : "";
    document.getElementById("prod-serves").value = prod ? (prod.serves || "") : "";
    document.getElementById("prod-price").value = prod ? (prod.price || "") : "";
    document.getElementById("prod-price250ml").value = prod ? (prod.price250ml || "") : "";
    document.getElementById("prod-price500ml").value = prod ? (prod.price500ml || "") : "";
    document.getElementById("prod-allowWeightChoice").checked = Boolean(prod?.allowWeightChoice);
    document.getElementById("prod-isPopular").checked = Boolean(prod?.isPopular);
    document.getElementById("prod-isAvailable").checked = prod ? prod.isAvailable !== false : true;
    document.getElementById("prod-image").value = prod ? (prod.image || "") : "";

    productModal.classList.remove("hidden");
    productModal.classList.add("flex");
    refreshIcons();
  }

  function closeProductModal() {
    productModal.classList.add("hidden");
    productModal.classList.remove("flex");
  }

  const newProdBtn = document.getElementById("new-product-btn");
  if (newProdBtn) newProdBtn.addEventListener("click", () => openProductModal(null));

  const closeProdBtn = document.getElementById("close-product-modal");
  if (closeProdBtn) closeProdBtn.addEventListener("click", closeProductModal);

  const cancelProdBtn = document.getElementById("cancel-product-modal");
  if (cancelProdBtn) cancelProdBtn.addEventListener("click", closeProductModal);

  if (productForm) {
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
        price: Number(document.getElementById("prod-price").value || 0),
        price250ml: document.getElementById("prod-price250ml").value ? Number(document.getElementById("prod-price250ml").value) : null,
        price500ml: document.getElementById("prod-price500ml").value ? Number(document.getElementById("prod-price500ml").value) : null,
        allowWeightChoice: document.getElementById("prod-allowWeightChoice").checked,
        isPopular: document.getElementById("prod-isPopular").checked,
        isAvailable: document.getElementById("prod-isAvailable").checked,
        image: document.getElementById("prod-image").value.trim()
      };

      try {
        if (isEdit && id) {
          await apiFetch(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
          showToast("Prato atualizado!");
        } else {
          await apiFetch("/admin/products", { method: "POST", body: JSON.stringify(payload) });
          showToast("Prato cadastrado com sucesso!");
        }
        closeProductModal();
        await loadCatalog();
        await loadDashboard(currentPeriod);
        broadcastSync();
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Upload local de imagem para converter em base64
  const imgFileInput = document.getElementById("prod-image-file");
  if (imgFileInput) {
    imgFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.getElementById("prod-image").value = evt.target.result;
        showToast("Imagem carregada!");
      };
      reader.readAsDataURL(file);
    });
  }

  // ==========================================================================
  // RENDERIZAR ABA 3: PEDIDOS RECEBIDOS
  // ==========================================================================

  function renderOrdersTab() {
    const listEl = document.getElementById("admin-orders-list");
    if (!listEl) return;

    const orders = dashboardData?.recentOrders || [];

    if (orders.length === 0) {
      listEl.innerHTML = `<div class="text-center py-12 text-slate-400 text-xs">Ainda não há pedidos recebidos.</div>`;
      return;
    }

    listEl.innerHTML = orders.map(ord => {
      const orderId = ord._id || ord.orderNumber;
      const dateStr = new Date(ord.createdAt).toLocaleString("pt-BR");
      const cleanPhone = (ord.customer?.whatsapp || "").replace(/\D/g, "");
      const waLink = cleanPhone ? `https://wa.me/55${cleanPhone.replace(/^55/, "")}` : "#";

      return `
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <span class="bg-[#072a29] text-white font-extrabold text-xs px-3 py-1 rounded-lg">
                ${ord.orderCode || "#" + ord.orderNumber}
              </span>
              <div>
                <h4 class="font-bold text-sm text-[#072a29]">${ord.customer?.name || "Cliente"}</h4>
                <span class="text-[11px] text-slate-500">${dateStr} • ${ord.customer?.modality === "pickup" ? "Retirada no Balcão" : "Entrega (Delivery)"}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <select data-order-status="${orderId}" class="bg-[#f8faf9] border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#072a29] focus:outline-none">
                <option value="novo" ${ord.status === "novo" ? "selected" : ""}>Novo Pedido</option>
                <option value="confirmado" ${ord.status === "confirmado" ? "selected" : ""}>Confirmado</option>
                <option value="preparo" ${ord.status === "preparo" ? "selected" : ""}>Em Preparo</option>
                <option value="saiu_entrega" ${ord.status === "saiu_entrega" ? "selected" : ""}>Saiu p/ Entrega</option>
                <option value="concluido" ${ord.status === "concluido" ? "selected" : ""}>Concluído</option>
                <option value="cancelado" ${ord.status === "cancelado" ? "selected" : ""}>Cancelado</option>
              </select>
              ${cleanPhone ? `
                <a href="${waLink}" target="_blank" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
                  WhatsApp
                </a>
              ` : ""}
              <button data-del-order="${orderId}" class="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Remover pedido">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <span class="text-slate-500 font-bold uppercase text-[10px]">Itens:</span>
              ${(ord.items || []).map(it => `
                <div class="flex justify-between py-1 border-b border-slate-100 last:border-0">
                  <span class="text-slate-700 font-medium">${it.quantity}x ${it.name} ${it.portion ? `(${it.portion})` : ""}</span>
                  <span class="text-[#072a29] font-bold">${formatBRL(it.subtotal)}</span>
                </div>
              `).join("")}
            </div>
            <div class="space-y-1 text-slate-600">
              <p><strong>Endereço:</strong> ${ord.customer?.address || "Retirada no Balcão"} ${ord.customer?.reference ? `(${ord.customer.reference})` : ""}</p>
              <p><strong>Pagamento:</strong> ${(ord.payment?.method || "PIX").toUpperCase()} ${ord.payment?.changeFor ? `(Troco para ${ord.payment.changeFor})` : ""}</p>
              ${ord.generalNotes ? `<p><strong>Obs:</strong> ${ord.generalNotes}</p>` : ""}
              <p class="pt-2 font-extrabold text-base text-emerald-700">TOTAL: ${formatBRL(ord.totalAmount)}</p>
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
          showToast("Status atualizado!");
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
    if (!container) return;

    const cats = catalogData.categories || [];

    container.innerHTML = cats.map(cat => `
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ordem #${cat.order || 1}
            </span>
            <span class="text-xs text-slate-500">${(cat.items || []).length} pratos</span>
          </div>
          <h3 class="font-extrabold text-base text-[#072a29] mt-2">${cat.title}</h3>
          <p class="text-xs text-slate-500">${cat.subtitle || "Sem subtítulo"}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <span class="text-[11px] text-slate-400">${cat.type === "portion-columns" ? "Colunas 250g/500g" : "Card Padrão"}</span>
          <div class="flex items-center gap-1.5">
            <button data-edit-cat="${cat.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
              Editar
            </button>
            <button data-del-cat="${cat.id}" class="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    container.querySelectorAll("[data-edit-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-cat");
        const cat = catalogData.categories.find(c => c.id === id);
        if (cat) openCategoryModal(cat);
      });
    });

    container.querySelectorAll("[data-del-cat]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del-cat");
        if (!confirm("Excluir esta categoria? Os produtos vinculados a ela permanecerão.")) return;
        try {
          await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
          await loadCatalog();
          broadcastSync();
          showToast("Categoria removida.");
        } catch (err) {
          showToast(err.message, true);
        }
      });
    });

    refreshIcons();
  }

  // Modal Categoria
  const categoryModal = document.getElementById("category-modal");
  const categoryForm = document.getElementById("category-form");

  function openCategoryModal(cat = null) {
    const isEdit = Boolean(cat);
    document.getElementById("cat-is-edit").value = isEdit ? "true" : "false";
    document.getElementById("category-modal-title").textContent = isEdit ? "Editar Categoria" : "Nova Categoria";
    document.getElementById("cat-id").value = cat ? cat.id : "";
    document.getElementById("cat-title").value = cat ? cat.title : "";
    document.getElementById("cat-subtitle").value = cat ? (cat.subtitle || "") : "";
    document.getElementById("cat-type").value = cat ? (cat.type || "single") : "single";
    document.getElementById("cat-order").value = cat ? (cat.order || 1) : (catalogData.categories.length + 1);

    categoryModal.classList.remove("hidden");
    categoryModal.classList.add("flex");
    refreshIcons();
  }

  function closeCategoryModal() {
    categoryModal.classList.add("hidden");
    categoryModal.classList.remove("flex");
  }

  const newCatBtn = document.getElementById("new-category-btn");
  if (newCatBtn) newCatBtn.addEventListener("click", () => openCategoryModal(null));

  const closeCatBtn = document.getElementById("close-category-modal");
  if (closeCatBtn) closeCatBtn.addEventListener("click", closeCategoryModal);

  const cancelCatBtn = document.getElementById("cancel-category-modal");
  if (cancelCatBtn) cancelCatBtn.addEventListener("click", closeCategoryModal);

  if (categoryForm) {
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
        broadcastSync();
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // ==========================================================================
  // ABA 5: CONFIGURAÇÕES DA LOJA & BACKUP LOCAL EM JSON
  // ==========================================================================

  function updateQuickStatusUI(cfg) {
    const btn = document.getElementById("quick-store-status-btn");
    const ping = document.getElementById("quick-status-ping");
    const dot = document.getElementById("quick-status-dot");
    const text = document.getElementById("quick-status-text");
    if (!btn || !text) return;

    const manualStatus = cfg?.manualStatus || "auto";
    const openHour = cfg?.openHour ?? 7;
    const closeHour = cfg?.closeHour ?? 14;

    let isOpen = false;
    let label = "";

    if (manualStatus === "force_open") {
      isOpen = true;
      label = "Loja Aberta (Forçado)";
    } else if (manualStatus === "force_closed") {
      isOpen = false;
      label = "Loja Fechada (Pausada)";
    } else {
      const nowH = new Date().getHours();
      isOpen = nowH >= openHour && nowH < closeHour;
      label = isOpen ? "Automático (Aberto)" : "Automático (Fechado)";
    }

    if (isOpen) {
      btn.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs cursor-pointer bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100";
      if (ping) ping.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
      if (dot) dot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
      text.textContent = label;
      btn.title = "Loja ABERTA. Clique para pausar/fechar o Delivery agora";
    } else {
      btn.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs cursor-pointer bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100";
      if (ping) ping.className = "hidden";
      if (dot) dot.className = "relative inline-flex rounded-full h-2 w-2 bg-rose-500";
      text.textContent = label;
      btn.title = "Loja FECHADA. Clique para abrir o Delivery agora";
    }
  }

  function populateSettingsForm(cfg) {
    updateQuickStatusUI(cfg);

    const manualStatus = document.getElementById("cfg-manualStatus");
    if (manualStatus) manualStatus.value = cfg.manualStatus || "auto";

    const openHour = document.getElementById("cfg-openHour");
    if (openHour) openHour.value = cfg.openHour ?? 7;

    const closeHour = document.getElementById("cfg-closeHour");
    if (closeHour) closeHour.value = cfg.closeHour ?? 14;

    const schedLabel = document.getElementById("cfg-scheduleLabel");
    if (schedLabel) schedLabel.value = cfg.scheduleLabel || "Todos os dias das 07h às 14h";

    const estTime = document.getElementById("cfg-estimatedTime");
    if (estTime) estTime.value = cfg.estimatedTime || "30-50 min";

    const wa = document.getElementById("cfg-whatsapp");
    if (wa) wa.value = cfg.whatsapp || "5591989379978";

    const phone = document.getElementById("cfg-phoneFormatted");
    if (phone) phone.value = cfg.phoneFormatted || "(91) 98937-9978";

    const tagline = document.getElementById("cfg-tagline");
    if (tagline) tagline.value = cfg.tagline || "";

    const feeNotice = document.getElementById("cfg-deliveryFeeNotice");
    if (feeNotice) feeNotice.value = cfg.deliveryFeeNotice || "";
  }

  // Alternador Rápido de Status no Topo do Painel
  const quickStatusBtn = document.getElementById("quick-store-status-btn");
  if (quickStatusBtn) {
    quickStatusBtn.addEventListener("click", async () => {
      const current = catalogData?.config?.manualStatus || "auto";
      const next = current === "force_open" ? "force_closed" : "force_open";
      try {
        quickStatusBtn.disabled = true;
        await apiFetch("/admin/toggle-status", {
          method: "POST",
          body: JSON.stringify({ status: next })
        });
        await loadCatalog();
        broadcastSync();
        const msg = next === "force_open"
          ? "🟢 Loja ABERTA com sucesso! Sincronizado ao vivo no Delivery."
          : "🔴 Loja FECHADA temporariamente! Sincronizado ao vivo no Delivery.";
        showToast(msg);
      } catch (err) {
        showToast(err.message, true);
      } finally {
        quickStatusBtn.disabled = false;
      }
    });
  }

  // Auto-salvar imediato quando o usuário altera o select de Status de Operação
  const manualStatusSelect = document.getElementById("cfg-manualStatus");
  if (manualStatusSelect) {
    manualStatusSelect.addEventListener("change", async () => {
      const newStatus = manualStatusSelect.value;
      try {
        await apiFetch("/admin/config", {
          method: "PUT",
          body: JSON.stringify({ manualStatus: newStatus })
        });
        await loadCatalog();
        broadcastSync();
        const lbl = newStatus === "force_open"
          ? "Forçar ABERTO"
          : newStatus === "force_closed"
          ? "Forçar FECHADO"
          : "Automático pelo Horário";
        showToast(`Status atualizado para: ${lbl}! Sincronizado ao vivo.`);
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  const storeForm = document.getElementById("store-config-form");
  if (storeForm) {
    storeForm.addEventListener("submit", async (e) => {
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
        broadcastSync();
        showToast("Configurações salvas e sincronizadas com o Delivery!");
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Exportar Backup
  const exportBtn = document.getElementById("export-backup-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      try {
        const data = await apiFetch("/admin/backup");
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-peixaria-mancha-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Backup baixado com sucesso!");
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Importar Backup
  const importInput = document.getElementById("import-backup-input");
  if (importInput) {
    importInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const backupData = JSON.parse(evt.target.result);
            const res = await apiFetch("/admin/restore", {
              method: "POST",
              body: JSON.stringify({ backupData })
            });
            await loadAllData();
            showToast(res.message);
          } catch (parseErr) {
            showToast("Arquivo JSON inválido: " + parseErr.message, true);
          }
        };
        reader.readAsText(file);
      } catch (err) {
        showToast(err.message, true);
      } finally {
        importInput.value = "";
      }
    });
  }

  // Restaurar Cardápio de Fábrica
  const resetBtn = document.getElementById("reset-factory-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("Restaurar o cardápio original de fábrica? Todos os pratos e categorias voltarão ao padrão inicial.")) {
        return;
      }
      try {
        const res = await apiFetch("/admin/restore", {
          method: "POST",
          body: JSON.stringify({ resetFactory: true })
        });
        await loadAllData();
        showToast(res.message);
      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Alterar Credenciais Admin
  const adminCredForm = document.getElementById("admin-credentials-form");
  if (adminCredForm) {
    adminCredForm.addEventListener("submit", async (e) => {
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
  }

  // Inicializar
  checkSession();
});
