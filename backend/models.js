const mongoose = require('mongoose');

// 1. Configurações Gerais do Delivery
const DeliveryConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  openHour: { type: Number, default: 7 },
  closeHour: { type: Number, default: 14 },
  scheduleLabel: { type: String, default: 'Todos os dias das 07h às 14h' },
  manualStatus: {
    type: String,
    enum: ['auto', 'force_open', 'force_closed'],
    default: 'auto'
  },
  estimatedTime: { type: String, default: '30-50 min' },
  tagline: { type: String, default: 'Qualidade que você sente, sabor que você ama!' },
  freshFishBadge: { type: String, default: 'PEIXE FRESCO TODOS OS DIAS!' },
  qualityGuarantee: { type: String, default: 'QUALIDADE GARANTIDA, SABOR QUE FAZ A DIFERENÇA!' },
  location: { type: String, default: 'Belém & Ananindeua' },
  whatsapp: { type: String, default: '5591989379978' },
  phoneFormatted: { type: String, default: '(91) 98937-9978' },
  instagram: { type: String, default: '@peixaria.mancha' },
  instagramUrl: { type: String, default: 'https://instagram.com/peixaria.mancha' },
  deliveryFeeNotice: {
    type: String,
    default: 'A atendente informará a taxa de entrega exata de acordo com a sua região (bairro de Belém ou Ananindeua). Aguarde a confirmação rápida no WhatsApp.'
  },
  minWeightGrams: { type: Number, default: 500 },
  maxWeightGrams: { type: Number, default: 2000 },
  weightStepGrams: { type: Number, default: 100 }
}, { timestamps: true });

// 2. Categorias do Cardápio
const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  type: { type: String, enum: ['single', 'portion-columns'], default: 'single' },
  iconName: { type: String, default: 'Fish' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 3. Produtos do Cardápio
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  badge: { type: String, default: '' },
  price: { type: Number, default: 0 },
  priceFormatted: { type: String, default: '' },
  price250ml: { type: Number, default: null },
  price250mlFormatted: { type: String, default: '' },
  price500ml: { type: Number, default: null },
  price500mlFormatted: { type: String, default: '' },
  unitType: { type: String, default: 'KG' }, // KG, UNIDADE, BANDA, PORÇÃO
  allowWeightChoice: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  serves: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  revenueGenerated: { type: Number, default: 0 }
}, { timestamps: true });

// Helper para formatar moeda BRL automaticamente antes de salvar
function formatBRL(val) {
  if (val === null || val === undefined || val === '' || isNaN(Number(val)) || Number(val) <= 0) {
    return '';
  }
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
}

ProductSchema.pre('save', function (next) {
  if (this.price !== null && this.price !== undefined && Number(this.price) > 0) {
    this.priceFormatted = formatBRL(this.price);
  } else {
    this.priceFormatted = '';
  }
  if (this.price250ml !== null && this.price250ml !== undefined && Number(this.price250ml) > 0) {
    this.price250mlFormatted = formatBRL(this.price250ml);
  } else {
    this.price250mlFormatted = '';
  }
  if (this.price500ml !== null && this.price500ml !== undefined && Number(this.price500ml) > 0) {
    this.price500mlFormatted = formatBRL(this.price500ml);
  } else {
    this.price500mlFormatted = '';
  }
  next();
});

// 4. Pedidos (Orders) para Dashboard e Controle de Vendas
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  categoryId: { type: String, default: '' },
  portion: { type: String, default: '' },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  subtotal: { type: Number, required: true },
  notes: { type: String, default: '' },
  image: { type: String, default: '' }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true },
  orderCode: { type: String, index: true },
  customer: {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    modality: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    address: { type: String, default: '' },
    reference: { type: String, default: '' }
  },
  payment: {
    method: { type: String, enum: ['pix', 'credit', 'debit', 'cash'], default: 'pix' },
    changeFor: { type: String, default: '' }
  },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  generalNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['novo', 'confirmado', 'preparo', 'saiu_entrega', 'concluido', 'cancelado'],
    default: 'novo',
    index: true
  },
  source: { type: String, default: 'site_delivery' }
}, { timestamps: true });

// 5. Usuário Admin
const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: 'Administrador Mancha' },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = {
  DeliveryConfig: mongoose.model('DeliveryConfig', DeliveryConfigSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  Order: mongoose.model('Order', OrderSchema),
  AdminUser: mongoose.model('AdminUser', AdminUserSchema),
  formatBRL
};
