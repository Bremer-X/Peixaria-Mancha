require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const { DeliveryConfig, Category, Product, Order, AdminUser, formatBRL } = require('./models');
const { runAutoSeed, INITIAL_CONFIG, INITIAL_CATEGORIES, INITIAL_PRODUCTS } = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'peixaria-mancha-secret-key-2026';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Servir os arquivos estáticos do site inteiro para facilitar uso local/VPS
app.use(express.static(path.join(__dirname, '..')));

// Estado da conexão MongoDB
let isMongoConnected = false;
let currentMongoUri = process.env.MONGODB_URI || '';

async function connectToMongo(uri) {
  if (!uri) {
    console.log('ℹ️ [MongoDB] Nenhuma MONGODB_URI definida no .env ainda. Rodando em modo Fallback Local até configurar.');
    return false;
  }
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    currentMongoUri = uri;
    console.log('🚀 [MongoDB] Conectado com sucesso ao banco de dados!');
    await runAutoSeed();
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.error('❌ [MongoDB] Erro ao conectar:', err.message);
    return false;
  }
}

// Armazenamento JSON local de fallback caso o MongoDB ainda não esteja configurado
const LOCAL_DB_PATH = path.join(__dirname, 'local-fallback-db.json');

function getLocalDb() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialProductsFormatted = INITIAL_PRODUCTS.map(p => ({
      ...p,
      priceFormatted: p.price ? formatBRL(p.price) : '',
      price250mlFormatted: p.price250ml ? formatBRL(p.price250ml) : '',
      price500mlFormatted: p.price500ml ? formatBRL(p.price500ml) : '',
      salesCount: 0,
      revenueGenerated: 0
    }));
    const initialData = {
      config: INITIAL_CONFIG,
      categories: INITIAL_CATEGORIES,
      products: initialProductsFormatted,
      orders: [],
      admin: {
        email: process.env.ADMIN_EMAIL || 'admin@peixariamancha.com.br',
        password: process.env.ADMIN_PASSWORD || 'mancha2026'
      }
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
}

function saveLocalDb(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

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
// 1. ROTAS DE AUTENTICAÇÃO E CONFIGURAÇÃO DE BANCO
// ============================================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoConnected) {
      const admin = await AdminUser.findOne({ email: cleanEmail });
      if (!admin) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }
      const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, email: admin.email, name: admin.name, dbMode: 'mongodb' });
    } else {
      const localDb = getLocalDb();
      if (cleanEmail === localDb.admin.email.toLowerCase() && password === localDb.admin.password) {
        const token = jwt.sign({ email: localDb.admin.email }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, email: localDb.admin.email, name: 'Administrador Mancha', dbMode: 'local_fallback' });
      }
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    admin: req.admin,
    dbMode: isMongoConnected ? 'mongodb' : 'local_fallback',
    mongoConfigured: Boolean(currentMongoUri)
  });
});

app.put('/api/auth/credentials', authMiddleware, async (req, res) => {
  try {
    const { newEmail, newPassword } = req.body;
    if (!newEmail || !newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Informe um e-mail válido e senha com pelo menos 4 caracteres.' });
    }
    if (isMongoConnected) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await AdminUser.findOneAndUpdate(
        {},
        { email: newEmail.trim().toLowerCase(), passwordHash },
        { upsert: true }
      );
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

// Configurar/Testar URI do MongoDB direto pelo Painel Admin
app.post('/api/admin/database', authMiddleware, async (req, res) => {
  try {
    const { mongoUri } = req.body;
    if (!mongoUri || !mongoUri.startsWith('mongodb')) {
      return res.status(400).json({ error: 'URI do MongoDB inválida. Deve começar com mongodb:// ou mongodb+srv://' });
    }
    const connected = await connectToMongo(mongoUri.trim());
    if (!connected) {
      return res.status(400).json({ error: 'Não foi possível conectar ao MongoDB com a URI informada. Verifique usuário, senha e IP Whitelist.' });
    }

    // Salvar no arquivo .env para persistir
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('MONGODB_URI=')) {
        envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUri.trim()}`);
      } else {
        envContent += `\nMONGODB_URI=${mongoUri.trim()}\n`;
      }
    } else {
      envContent = `PORT=${PORT}\nMONGODB_URI=${mongoUri.trim()}\nJWT_SECRET=${JWT_SECRET}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');

    // Sincronizar dados locais se houver pedidos/edições feitas antes de conectar o MongoDB
    const localDb = getLocalDb();
    if (localDb.orders && localDb.orders.length > 0) {
      const existingOrdersCount = await Order.countDocuments();
      if (existingOrdersCount === 0) {
        await Order.insertMany(localDb.orders);
      }
    }

    res.json({ message: 'Conectado ao MongoDB com sucesso! Dados sincronizados.', dbMode: 'mongodb' });
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

    if (isMongoConnected) {
      const config = await DeliveryConfig.findOne({ key: 'main' }).lean() || INITIAL_CONFIG;
      const catFilter = includeUnavailable ? {} : { isActive: true };
      const categories = await Category.find(catFilter).sort({ order: 1 }).lean();
      const prodFilter = includeUnavailable ? {} : { isAvailable: true };
      const products = await Product.find(prodFilter).sort({ order: 1 }).lean();

      const categoriesWithItems = categories.map(cat => ({
        ...cat,
        items: products.filter(p => p.categoryId === cat.id)
      }));

      return res.json({
        config,
        categories: categoriesWithItems,
        allProducts: products,
        dbMode: 'mongodb'
      });
    } else {
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
        dbMode: 'local_fallback'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 3. ROTA DE REGISTRO DE PEDIDOS DO DELIVERY (POST /api/delivery/orders)
// ============================================================================

app.post('/api/delivery/orders', async (req, res) => {
  try {
    const { customer, payment, items, totalAmount, generalNotes } = req.body;
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }

    const formattedItems = items.map(item => ({
      productId: item.menuItemId || item.productId || item.id,
      name: item.name,
      categoryId: item.categoryId || '',
      portion: item.portion || '',
      unitPrice: Number(item.price || item.unitPrice || 0),
      quantity: Number(item.quantity || 1),
      subtotal: Number(item.price || item.unitPrice || 0) * Number(item.quantity || 1),
      notes: item.notes || '',
      image: item.image || ''
    }));

    const calculatedTotal = formattedItems.reduce((acc, cur) => acc + cur.subtotal, 0);

    if (isMongoConnected) {
      const lastOrder = await Order.findOne().sort({ orderNumber: -1 }).lean();
      const nextNum = (lastOrder && lastOrder.orderNumber) ? lastOrder.orderNumber + 1 : 1001;
      const orderCode = `#${nextNum}`;

      const newOrder = await Order.create({
        orderNumber: nextNum,
        orderCode,
        customer,
        payment,
        items: formattedItems,
        totalAmount: totalAmount || calculatedTotal,
        generalNotes: generalNotes || '',
        status: 'novo'
      });

      // Atualizar contadores de vendas dos produtos
      for (const it of formattedItems) {
        await Product.findOneAndUpdate(
          { id: it.productId },
          { $inc: { salesCount: it.quantity, revenueGenerated: it.subtotal } }
        );
      }

      return res.status(201).json({ order: newOrder });
    } else {
      const localDb = getLocalDb();
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

      // Atualizar contadores no localDb
      for (const it of formattedItems) {
        const prod = localDb.products.find(p => p.id === it.productId);
        if (prod) {
          prod.salesCount = (prod.salesCount || 0) + it.quantity;
          prod.revenueGenerated = (prod.revenueGenerated || 0) + it.subtotal;
        }
      }
      saveLocalDb(localDb);
      return res.status(201).json({ order: newOrder });
    }
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

    let orders = [];
    let products = [];
    let categories = [];

    if (isMongoConnected) {
      const query = startDate ? { createdAt: { $gte: startDate } } : {};
      orders = await Order.find(query).sort({ createdAt: -1 }).lean();
      products = await Product.find().lean();
      categories = await Category.find().lean();
    } else {
      const localDb = getLocalDb();
      orders = (localDb.orders || []).filter(o => {
        if (!startDate) return true;
        return new Date(o.createdAt) >= startDate;
      });
      products = localDb.products || [];
      categories = localDb.categories || [];
    }

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
        const pid = item.productId || item.name;
        if (!productStatsMap[pid]) {
          const catalogProd = products.find(p => p.id === pid);
          productStatsMap[pid] = {
            productId: pid,
            name: item.name,
            categoryId: catalogProd?.categoryId || item.categoryId || 'outros',
            unitType: catalogProd?.unitType || '',
            image: catalogProd?.image || item.image || '',
            quantitySold: 0,
            ordersCount: 0,
            revenue: 0,
            portionsBreakdown: {}
          };
        }
        productStatsMap[pid].quantitySold += Number(item.quantity || 1);
        productStatsMap[pid].ordersCount += 1;
        productStatsMap[pid].revenue += Number(item.subtotal || 0);

        const portionKey = item.portion || 'Padrão';
        productStatsMap[pid].portionsBreakdown[portionKey] =
          (productStatsMap[pid].portionsBreakdown[portionKey] || 0) + Number(item.quantity || 1);

        const catId = productStatsMap[pid].categoryId;
        if (categoryStatsMap[catId]) {
          categoryStatsMap[catId].quantity += Number(item.quantity || 1);
          categoryStatsMap[catId].revenue += Number(item.subtotal || 0);
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
    if (isMongoConnected) {
      const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ order: updated });
    } else {
      const localDb = getLocalDb();
      const order = localDb.orders.find(o => o._id === id || String(o.orderNumber) === String(id));
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
      order.status = status;
      saveLocalDb(localDb);
      return res.json({ order });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir pedido de teste
app.delete('/api/admin/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Order.findByIdAndDelete(id);
    } else {
      const localDb = getLocalDb();
      localDb.orders = localDb.orders.filter(o => o._id !== id && String(o.orderNumber) !== String(id));
      saveLocalDb(localDb);
    }
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
      order: Number(payload.order || 99)
    };

    if (isMongoConnected) {
      const doc = new Product(productData);
      await doc.save();
      return res.status(201).json({ product: doc });
    } else {
      const localDb = getLocalDb();
      productData.priceFormatted = productData.price ? formatBRL(productData.price) : '';
      productData.price250mlFormatted = productData.price250ml ? formatBRL(productData.price250ml) : '';
      productData.price500mlFormatted = productData.price500ml ? formatBRL(productData.price500ml) : '';
      localDb.products.push(productData);
      saveLocalDb(localDb);
      return res.status(201).json({ product: productData });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (isMongoConnected) {
      const prod = await Product.findOne({ id });
      if (!prod) return res.status(404).json({ error: 'Produto não encontrado.' });

      Object.keys(payload).forEach(key => {
        if (key !== '_id' && key !== 'id') {
          prod[key] = payload[key];
        }
      });
      await prod.save();
      return res.json({ product: prod });
    } else {
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
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Product.findOneAndDelete({ id });
    } else {
      const localDb = getLocalDb();
      localDb.products = localDb.products.filter(p => p.id !== id);
      saveLocalDb(localDb);
    }
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

    if (isMongoConnected) {
      const created = await Category.create(catData);
      return res.status(201).json({ category: created });
    } else {
      const localDb = getLocalDb();
      localDb.categories.push(catData);
      saveLocalDb(localDb);
      return res.status(201).json({ category: catData });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (isMongoConnected) {
      const updated = await Category.findOneAndUpdate({ id }, payload, { new: true });
      return res.json({ category: updated });
    } else {
      const localDb = getLocalDb();
      const idx = localDb.categories.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Categoria não encontrada.' });
      localDb.categories[idx] = { ...localDb.categories[idx], ...payload };
      saveLocalDb(localDb);
      return res.json({ category: localDb.categories[idx] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Category.findOneAndDelete({ id });
    } else {
      const localDb = getLocalDb();
      localDb.categories = localDb.categories.filter(c => c.id !== id);
      saveLocalDb(localDb);
    }
    res.json({ message: 'Categoria removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/config', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    if (isMongoConnected) {
      const config = await DeliveryConfig.findOneAndUpdate(
        { key: 'main' },
        { $set: payload },
        { new: true, upsert: true }
      );
      return res.json({ config });
    } else {
      const localDb = getLocalDb();
      localDb.config = { ...localDb.config, ...payload };
      saveLocalDb(localDb);
      return res.json({ config: localDb.config });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicializar servidor
connectToMongo(currentMongoUri).then(() => {
  app.listen(PORT, () => {
    console.log(`=========================================================`);
    console.log(`🐟 Servidor Peixaria Mancha rodando na porta ${PORT}`);
    console.log(`👉 Cardápio Delivery: http://localhost:${PORT}/cardapio-delivery/`);
    console.log(`👉 Painel Admin & Dash: http://localhost:${PORT}/admin-mancha/`);
    console.log(`=========================================================`);
  });
});
