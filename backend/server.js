require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const { formatBRL } = require('./models');
const { INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS } = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'peixaria-mancha-secret-key-2026';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Servir os arquivos estáticos do site inteiro para facilitar uso local
app.use(express.static(path.join(__dirname, '..')));

// Caminhos dos arquivos locais de banco de dados dentro do projeto
const LOCAL_DB_PATH = path.join(__dirname, 'local-fallback-db.json');
const STATIC_CATALOG_PATH = path.join(__dirname, '..', 'cardapio-delivery', 'catalog-data.json');

function buildInitialData() {
  const initialProductsFormatted = INITIAL_PRODUCTS.map(p => ({
    ...p,
    priceFormatted: p.price ? formatBRL(p.price) : '',
    price250mlFormatted: p.price250ml ? formatBRL(p.price250ml) : '',
    price500mlFormatted: p.price500ml ? formatBRL(p.price500ml) : '',
    salesCount: 0,
    revenueGenerated: 0
  }));
  return {
    config: INITIAL_CONFIG,
    categories: INITIAL_CATEGORIES,
    products: initialProductsFormatted,
    orders: [],
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@peixariamancha.com.br',
      password: process.env.ADMIN_PASSWORD || 'mancha2026'
    }
  };
}

function syncStaticCatalogFile(dbData) {
  try {
    const categories = (dbData.categories || [])
      .filter(c => c.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const products = (dbData.products || [])
      .filter(p => p.isAvailable !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const categoriesWithItems = categories.map(cat => ({
      ...cat,
      items: products.filter(p => p.categoryId === cat.id)
    }));

    const catalogPayload = {
      config: dbData.config || INITIAL_CONFIG,
      categories: categoriesWithItems,
      allProducts: dbData.products || [],
      dbMode: 'local_json',
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(STATIC_CATALOG_PATH, JSON.stringify(catalogPayload, null, 2), 'utf8');
  } catch (err) {
    console.error('Erro ao sincronizar catalog-data.json:', err.message);
  }
}

function getLocalDb() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialData = buildInitialData();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    syncStaticCatalogFile(initialData);
    return initialData;
  }
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
}

function saveLocalDb(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  syncStaticCatalogFile(data);
  notifyCatalogSync(data.config);
}

// Garantir que o banco local e o arquivo estático do cardápio estejam sincronizados ao iniciar
syncStaticCatalogFile(getLocalDb());

// Middleware de Autenticação JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
}

// ============================================================================
// 1. ROTAS DE AUTENTICAÇÃO E BACKUP DO BANCO LOCAL
// ============================================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const localDb = getLocalDb();

    const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@peixariamancha.com.br').toLowerCase();
    const defaultPassword = process.env.ADMIN_PASSWORD || 'mancha2026';
    const dbEmail = (localDb.admin?.email || '').toLowerCase();
    const dbPassword = localDb.admin?.password || '';

    const isMatch = (cleanEmail === dbEmail && password === dbPassword) ||
                    (cleanEmail === defaultEmail && password === defaultPassword);

    if (isMatch) {
      const activeEmail = cleanEmail === dbEmail ? localDb.admin.email : defaultEmail;
      const token = jwt.sign({ email: activeEmail }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        email: activeEmail,
        name: 'Administrador Mancha',
        dbMode: 'local_json'
      });
    }
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    admin: req.admin,
    dbMode: 'local_json'
  });
});

app.put('/api/auth/credentials', authMiddleware, async (req, res) => {
  try {
    const { newEmail, newPassword } = req.body;
    if (!newEmail || !newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Informe um e-mail válido e senha com pelo menos 4 caracteres.' });
    }
    const localDb = getLocalDb();
    localDb.admin.email = newEmail.trim().toLowerCase();
    localDb.admin.password = newPassword;
    saveLocalDb(localDb);

    res.json({ message: 'Credenciais de acesso atualizadas com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar backup completo do banco local
app.get('/api/admin/backup', authMiddleware, (req, res) => {
  try {
    const localDb = getLocalDb();
    res.json(localDb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Importar backup ou restaurar padrão de fábrica
app.post('/api/admin/restore', authMiddleware, (req, res) => {
  try {
    const { backupData, resetFactory } = req.body;
    const currentDb = getLocalDb();

    if (resetFactory) {
      const fresh = buildInitialData();
      fresh.admin = currentDb.admin; // preserva login atual
      saveLocalDb(fresh);
      return res.json({ message: 'Cardápio restaurado para o padrão original com sucesso!', dbMode: 'local_json' });
    }

    if (!backupData || !Array.isArray(backupData.categories) || !Array.isArray(backupData.products)) {
      return res.status(400).json({ error: 'Arquivo de backup inválido. Verifique o formato JSON.' });
    }

    const merged = {
      config: backupData.config || currentDb.config || INITIAL_CONFIG,
      categories: backupData.categories,
      products: backupData.products,
      orders: Array.isArray(backupData.orders) ? backupData.orders : (currentDb.orders || []),
      admin: backupData.admin || currentDb.admin
    };
    saveLocalDb(merged);
    res.json({ message: 'Backup importado e salvo localmente no projeto com sucesso!', dbMode: 'local_json' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 2. ROTA PÚBLICA DO CARDÁPIO DELIVERY (GET /api/delivery/catalog)
// ============================================================================

app.get('/api/delivery/catalog', async (req, res) => {
  try {
    const includeUnavailable = req.query.all === 'true';
    const localDb = getLocalDb();

    const categories = localDb.categories
      .filter(c => includeUnavailable || c.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const products = localDb.products
      .filter(p => includeUnavailable || p.isAvailable !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const categoriesWithItems = categories.map(cat => ({
      ...cat,
      items: products.filter(p => p.categoryId === cat.id)
    }));

    return res.json({
      config: localDb.config,
      categories: categoriesWithItems,
      allProducts: products,
      dbMode: 'local_json'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 3. ROTA DE REGISTRO DE PEDIDOS DO DELIVERY & TEMPO REAL (AO VIVO)
// ============================================================================

const liveOrderClients = new Set();
const liveSyncClients = new Set();

app.get('/api/admin/live-orders', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.write('data: {"type":"CONNECTED"}\n\n');

  liveOrderClients.add(res);

  req.on('close', () => {
    liveOrderClients.delete(res);
  });
});

app.get('/api/delivery/live-sync', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  res.write('data: {"type":"CONNECTED"}\n\n');

  liveSyncClients.add(res);

  req.on('close', () => {
    liveSyncClients.delete(res);
  });
});

function notifyLiveOrder(order) {
  const payload = JSON.stringify({ type: 'NEW_ORDER', order });
  for (const client of liveOrderClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      liveOrderClients.delete(client);
    }
  }
}

function notifyCatalogSync(config) {
  const payload = JSON.stringify({ type: 'CATALOG_SYNC', config: config || {}, timestamp: Date.now() });
  for (const client of liveSyncClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      liveSyncClients.delete(client);
    }
  }
}

app.get('/api/admin/orders/latest', authMiddleware, (req, res) => {
  const localDb = getLocalDb();
  const latestOrder = localDb.orders && localDb.orders.length > 0 ? localDb.orders[0] : null;
  res.json({
    latestId: latestOrder ? (latestOrder._id || latestOrder.orderNumber) : null,
    totalOrders: localDb.orders ? localDb.orders.length : 0,
    latestCreatedAt: latestOrder ? latestOrder.createdAt : null
  });
});

app.post('/api/delivery/orders', async (req, res) => {
  try {
    const { customer, payment, items, totalAmount, generalNotes } = req.body;
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }

    const localDb = getLocalDb();

    const formattedItems = items.map(item => {
      const rawId = String(item.menuItemId || item.productId || item.id || '').trim();
      const rawName = String(item.name || '').trim().toLowerCase();

      // Busca produto no catálogo por id exato, menuItemId, nome ou prefixo
      const matchedProd = (localDb.products || []).find(p =>
        p.id === item.menuItemId ||
        p.id === item.productId ||
        p.id === item.id ||
        (rawName && p.name && p.name.trim().toLowerCase() === rawName) ||
        (rawId && p.id && (rawId === p.id || rawId.startsWith(p.id + '-')))
      );

      const resolvedId = matchedProd ? matchedProd.id : (rawId || 'prod_' + Date.now());
      const resolvedName = matchedProd ? matchedProd.name : (item.name || 'Produto');
      const resolvedCategory = matchedProd ? matchedProd.categoryId : (item.categoryId || 'outros');
      const unitPrice = Number(item.price || item.unitPrice || (matchedProd ? matchedProd.price : 0));
      const qty = Math.max(1, Number(item.quantity || 1));
      const subtotal = Number(item.subtotal || (unitPrice * qty));

      return {
        productId: resolvedId,
        name: resolvedName,
        categoryId: resolvedCategory,
        portion: item.portion || '',
        unitPrice,
        quantity: qty,
        subtotal,
        notes: item.notes || '',
        image: matchedProd?.image || item.image || ''
      };
    });

    const calculatedTotal = formattedItems.reduce((acc, cur) => acc + cur.subtotal, 0);

    const lastNum = localDb.orders.reduce((max, o) => Math.max(max, o.orderNumber || 1000), 1000);
    const nextNum = lastNum + 1;
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderNumber: nextNum,
      orderCode: `#${nextNum}`,
      customer,
      payment,
      items: formattedItems,
      totalAmount: totalAmount || calculatedTotal,
      generalNotes: generalNotes || '',
      status: 'novo',
      createdAt: new Date().toISOString()
    };
    localDb.orders.unshift(newOrder);

    // Atualizar contadores acumulados nos produtos do catálogo
    for (const it of formattedItems) {
      const prod = (localDb.products || []).find(p =>
        p.id === it.productId ||
        (it.name && p.name && p.name.trim().toLowerCase() === it.name.trim().toLowerCase())
      );
      if (prod) {
        prod.salesCount = (prod.salesCount || 0) + it.quantity;
        prod.revenueGenerated = (prod.revenueGenerated || 0) + it.subtotal;
      }
    }
    saveLocalDb(localDb);

    // Notificar painel administrativo imediatamente em tempo real (Ao Vivo)
    notifyLiveOrder(newOrder);

    return res.status(201).json({ order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 4. ROTAS ADMINISTRATIVAS DE DASHBOARD E PEDIDOS
// ============================================================================

app.get('/api/admin/dashboard', authMiddleware, async (req, res) => {
  try {
    const period = req.query.period || 'all'; // today, 7d, 30d, all
    let startDate = null;
    const now = new Date();

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const localDb = getLocalDb();
    const orders = (localDb.orders || []).filter(o => {
      if (!startDate) return true;
      return new Date(o.createdAt) >= startDate;
    });
    const products = localDb.products || [];
    const categories = localDb.categories || [];

    // Filtrar pedidos válidos (não cancelados) para métricas de receita
    const validOrders = orders.filter(o => o.status !== 'cancelado');
    const canceledOrders = orders.filter(o => o.status === 'cancelado');

    const totalRevenue = validOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
    const totalOrders = validOrders.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Contagem por modalidade e pagamento
    const byModality = { delivery: 0, pickup: 0 };
    const byPayment = { pix: 0, credit: 0, debit: 0, cash: 0 };

    // Ranking de produtos mais vendidos no período selecionado
    const productStatsMap = {};
    const categoryStatsMap = {};

    categories.forEach(c => {
      categoryStatsMap[c.id] = { id: c.id, title: c.title, quantity: 0, revenue: 0 };
    });

    validOrders.forEach(order => {
      const mod = order.customer?.modality || 'delivery';
      byModality[mod] = (byModality[mod] || 0) + 1;

      const pay = order.payment?.method || 'pix';
      byPayment[pay] = (byPayment[pay] || 0) + 1;

      (order.items || []).forEach(item => {
        const rawId = String(item.productId || item.menuItemId || item.id || '').trim();
        const rawName = String(item.name || '').trim().toLowerCase();

        // Encontrar produto correspondente no catálogo
        const catalogProd = (products || []).find(p =>
          p.id === rawId ||
          p.id === item.menuItemId ||
          p.id === item.productId ||
          p.id === item.id ||
          (rawName && p.name && p.name.trim().toLowerCase() === rawName) ||
          (rawId && p.id && (rawId === p.id || rawId.startsWith(p.id + '-')))
        );

        const canonicalId = catalogProd ? catalogProd.id : (rawId || rawName || 'prod_desconhecido');
        const canonicalName = catalogProd ? catalogProd.name : (item.name || 'Produto');
        const canonicalCat = catalogProd ? catalogProd.categoryId : (item.categoryId || 'outros');

        if (!productStatsMap[canonicalId]) {
          productStatsMap[canonicalId] = {
            productId: canonicalId,
            name: canonicalName,
            categoryId: canonicalCat,
            unitType: catalogProd?.unitType || '',
            image: catalogProd?.image || item.image || '',
            quantitySold: 0,
            ordersCount: 0,
            revenue: 0,
            portionsBreakdown: {}
          };
        }

        const qty = Math.max(1, Number(item.quantity || 1));
        const subtotal = Number(item.subtotal || (Number(item.unitPrice || 0) * qty));

        productStatsMap[canonicalId].quantitySold += qty;
        productStatsMap[canonicalId].ordersCount += 1;
        productStatsMap[canonicalId].revenue += subtotal;

        const portionKey = item.portion || 'Padrão';
        productStatsMap[canonicalId].portionsBreakdown[portionKey] =
          (productStatsMap[canonicalId].portionsBreakdown[portionKey] || 0) + qty;

        const catId = productStatsMap[canonicalId].categoryId;
        if (categoryStatsMap[catId]) {
          categoryStatsMap[catId].quantity += qty;
          categoryStatsMap[catId].revenue += subtotal;
        }
      });
    });

    const topProductsByQty = Object.values(productStatsMap)
      .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue);

    const topProductsByRevenue = Object.values(productStatsMap)
      .sort((a, b) => b.revenue - a.revenue);

    // Vendas por dia (últimos 7 dias)
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' });
      const dayOrders = validOrders.filter(o => {
        const od = new Date(o.createdAt).toISOString().slice(0, 10);
        return od === dayStr;
      });
      const dayRev = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      dailySales.push({ date: dayStr, label, orders: dayOrders.length, revenue: dayRev });
    }

    res.json({
      kpis: {
        totalRevenue,
        totalOrders,
        avgTicket,
        canceledCount: canceledOrders.length,
        activeProductsCount: products.filter(p => p.isAvailable !== false).length,
        totalProductsCount: products.length
      },
      byModality,
      byPayment,
      topProductsByQty,
      topProductsByRevenue,
      categoryPerformance: Object.values(categoryStatsMap),
      dailySales,
      recentOrders: orders.slice(0, 50)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status de um pedido
app.patch('/api/admin/orders/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const localDb = getLocalDb();
    const order = localDb.orders.find(o => o._id === id || String(o.orderNumber) === String(id));
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
    order.status = status;
    saveLocalDb(localDb);
    return res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir pedido
app.delete('/api/admin/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const localDb = getLocalDb();
    localDb.orders = localDb.orders.filter(o => o._id !== id && String(o.orderNumber) !== String(id));
    saveLocalDb(localDb);
    res.json({ message: 'Pedido removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 5. ROTAS ADMINISTRATIVAS DE PRODUTOS (CRUD COMPLETO)
// ============================================================================

app.post('/api/admin/products', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.categoryId) {
      return res.status(400).json({ error: 'Nome e Categoria são obrigatórios.' });
    }

    const slugId = payload.id || (payload.categoryId.split('-')[0] + '-' + payload.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4));

    const productData = {
      id: slugId,
      categoryId: payload.categoryId,
      name: payload.name.trim(),
      description: payload.description || '',
      badge: payload.badge || '',
      price: payload.price ? Number(payload.price) : 0,
      price250ml: payload.price250ml ? Number(payload.price250ml) : null,
      price500ml: payload.price500ml ? Number(payload.price500ml) : null,
      unitType: payload.unitType || 'KG',
      allowWeightChoice: Boolean(payload.allowWeightChoice),
      isPopular: Boolean(payload.isPopular),
      isAvailable: payload.isAvailable !== undefined ? Boolean(payload.isAvailable) : true,
      serves: payload.serves || '',
      image: payload.image || '',
      order: Number(payload.order || 99),
      salesCount: 0,
      revenueGenerated: 0
    };

    const localDb = getLocalDb();
    productData.priceFormatted = productData.price ? formatBRL(productData.price) : '';
    productData.price250mlFormatted = productData.price250ml ? formatBRL(productData.price250ml) : '';
    productData.price500mlFormatted = productData.price500ml ? formatBRL(productData.price500ml) : '';
    localDb.products.push(productData);
    saveLocalDb(localDb);
    return res.status(201).json({ product: productData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const localDb = getLocalDb();
    const idx = localDb.products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Produto não encontrado.' });

    const updated = { ...localDb.products[idx], ...payload };
    updated.priceFormatted = updated.price ? formatBRL(updated.price) : '';
    updated.price250mlFormatted = updated.price250ml ? formatBRL(updated.price250ml) : '';
    updated.price500mlFormatted = updated.price500ml ? formatBRL(updated.price500ml) : '';
    localDb.products[idx] = updated;
    saveLocalDb(localDb);
    return res.json({ product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const localDb = getLocalDb();
    localDb.products = localDb.products.filter(p => p.id !== id);
    saveLocalDb(localDb);
    res.json({ message: 'Produto excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 6. ROTAS ADMINISTRATIVAS DE CATEGORIAS E CONFIGURAÇÕES GERAIS
// ============================================================================

app.post('/api/admin/categories', authMiddleware, async (req, res) => {
  try {
    const { id, title, subtitle, type, iconName, order, isActive } = req.body;
    if (!title) return res.status(400).json({ error: 'Título da categoria é obrigatório.' });

    const slug = id || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
    const catData = {
      id: slug,
      title: title.trim().toUpperCase(),
      subtitle: (subtitle || '').trim().toUpperCase(),
      type: type || 'single',
      iconName: iconName || 'Fish',
      order: Number(order || 10),
      isActive: isActive !== undefined ? Boolean(isActive) : true
    };

    const localDb = getLocalDb();
    localDb.categories.push(catData);
    saveLocalDb(localDb);
    return res.status(201).json({ category: catData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const localDb = getLocalDb();
    const idx = localDb.categories.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Categoria não encontrada.' });
    localDb.categories[idx] = { ...localDb.categories[idx], ...payload };
    saveLocalDb(localDb);
    return res.json({ category: localDb.categories[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const localDb = getLocalDb();
    localDb.categories = localDb.categories.filter(c => c.id !== id);
    saveLocalDb(localDb);
    res.json({ message: 'Categoria removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/config', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    const localDb = getLocalDb();
    localDb.config = { ...localDb.config, ...payload };
    saveLocalDb(localDb);
    return res.json({ config: localDb.config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/toggle-status', authMiddleware, async (req, res) => {
  try {
    const localDb = getLocalDb();
    const current = localDb.config?.manualStatus || 'auto';
    const requested = req.body?.status;
    let next;
    if (requested) {
      next = requested;
    } else {
      next = current === 'force_open' ? 'force_closed' : 'force_open';
    }
    localDb.config = { ...localDb.config, manualStatus: next };
    saveLocalDb(localDb);
    return res.json({ manualStatus: next, config: localDb.config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicializar servidor 100% Local
app.listen(PORT, () => {
  console.log(`=========================================================`);
  console.log(`🐟 Servidor Local Peixaria Mancha rodando na porta ${PORT}`);
  console.log(`📂 Banco de Dados Local: backend/local-fallback-db.json`);
  console.log(`👉 Cardápio Delivery: http://localhost:${PORT}/cardapio-delivery/`);
  console.log(`👉 Painel Admin & Dash: http://localhost:${PORT}/admin-mancha/`);
  console.log(`=========================================================`);
});
