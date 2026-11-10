const bcrypt = require('bcryptjs');
const { DeliveryConfig, Category, Product, AdminUser } = require('./models');

const INITIAL_CONFIG = {
  key: 'main',
  openHour: 7,
  closeHour: 14,
  scheduleLabel: 'Todos os dias das 07h às 14h',
  manualStatus: 'auto',
  estimatedTime: '30-50 min',
  tagline: 'Qualidade que você sente, sabor que você ama!',
  freshFishBadge: 'PEIXE FRESCO TODOS OS DIAS!',
  qualityGuarantee: 'QUALIDADE GARANTIDA, SABOR QUE FAZ A DIFERENÇA!',
  location: 'Belém & Ananindeua',
  whatsapp: '5591989379978',
  phoneFormatted: '(91) 98937-9978',
  instagram: '@peixaria.mancha',
  instagramUrl: 'https://instagram.com/peixaria.mancha',
  deliveryFeeNotice: 'A atendente informará a taxa de entrega exata de acordo com a sua região (bairro de Belém ou Ananindeua). Aguarde a confirmação rápida no WhatsApp.',
  minWeightGrams: 500,
  maxWeightGrams: 2000,
  weightStepGrams: 100
};

const INITIAL_CATEGORIES = [
  {
    id: 'peixes-fritos',
    title: 'PEIXES FRITOS',
    subtitle: 'PRODUTOS PESADOS IN NATURA',
    type: 'single',
    iconName: 'Fish',
    order: 1,
    isActive: true
  },
  {
    id: 'peixes-assados',
    title: 'PEIXES ASSADOS',
    subtitle: 'ASSADOS NA BRASA COM TEMPERO ESPECIAL',
    type: 'single',
    iconName: 'Flame',
    order: 2,
    isActive: true
  },
  {
    id: 'porcoes-acompanhamento',
    title: 'PORÇÕES DE ACOMPANHAMENTO',
    subtitle: 'ESCOLHA O TAMANHO: PORÇÃO 250g OU 500g',
    type: 'portion-columns',
    iconName: 'Utensils',
    order: 3,
    isActive: true
  }
];

const INITIAL_PRODUCTS = [
  // PEIXES FRITOS
  {
    id: 'frito-file-filhote',
    categoryId: 'peixes-fritos',
    name: 'FILÉ DE FILHOTE FRITO (KG)',
    badge: 'FRITO CROCANTE',
    description: 'Filé nobre de Filhote amazônico frito crocante e sequinho por fora, macio e suculento por dentro (peso in natura).',
    price: 88,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: true,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 1
  },
  {
    id: 'frito-file-dourada',
    categoryId: 'peixes-fritos',
    name: 'FILÉ DE DOURADA (KG)',
    badge: 'PESO IN NATURA',
    description: 'Filé nobre de Dourada fresca empanada crocante.',
    price: 76,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: true,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 2
  },
  {
    id: 'frito-isca-dourada',
    categoryId: 'peixes-fritos',
    name: 'ISCA DE DOURADA (KG)',
    badge: 'PETISCO CAMPEÃO',
    description: 'Iscas selecionadas de Dourada fresca, crocantes e douradas.',
    price: 74,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: true,
    isAvailable: true,
    serves: 'Porção generosa',
    order: 3
  },
  {
    id: 'frito-pescada-amarela',
    categoryId: 'peixes-fritos',
    name: 'PESCADA AMARELA (KG)',
    badge: 'ESPECIALIDADE',
    description: 'Pescada amarela nobre de alta qualidade (pesado in natura).',
    price: 82,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: false,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 4
  },
  {
    id: 'frito-file-go',
    categoryId: 'peixes-fritos',
    name: 'FILÉ DE GÓ (KG)',
    badge: 'PESO IN NATURA',
    description: 'Filé de Gó fresco e frito no capricho (pesado in natura).',
    price: 74,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: false,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 5
  },
  {
    id: 'frito-pirarucu',
    categoryId: 'peixes-fritos',
    name: 'PIRARUCU FRESCO (KG)',
    badge: 'PRODUTO SAZONAL',
    description: 'Pirarucu fresco da Amazônia (produto sazonal, pesado in natura).',
    price: 85,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: false,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 6
  },
  {
    id: 'frito-go-inteira',
    categoryId: 'peixes-fritos',
    name: 'GÓ INTEIRA (UNIDADE)',
    badge: 'UNIDADE',
    description: 'Gó inteira frita sequinha e crocante.',
    price: 10,
    unitType: 'UNIDADE',
    allowWeightChoice: false,
    isPopular: false,
    isAvailable: true,
    serves: 'Individual',
    order: 7
  },

  // PEIXES ASSADOS
  {
    id: 'assado-tambaqui',
    categoryId: 'peixes-assados',
    name: 'TAMBAQUI A PARTIR (BANDA)',
    badge: 'BRASA PARAENSE',
    description: 'Banda nobre de Tambaqui assado na brasa, suculento e dourado.',
    price: 100,
    unitType: 'BANDA',
    allowWeightChoice: false,
    isPopular: true,
    isAvailable: true,
    serves: 'Serve 3 a 4 pessoas',
    order: 1
  },
  {
    id: 'assado-file-filhote',
    categoryId: 'peixes-assados',
    name: 'FILÉ DE FILHOTE ASSADO (KG)',
    badge: 'ASSADO NA BRASA',
    description: 'Filé nobre de Filhote assado na brasa com tempero especial da casa, textura macia e sabor defumado incomparável (peso in natura).',
    price: 90,
    unitType: 'KG',
    allowWeightChoice: true,
    isPopular: true,
    isAvailable: true,
    serves: 'Até 3 pessoas',
    order: 2
  },
  {
    id: 'assado-mapara',
    categoryId: 'peixes-assados',
    name: 'MAPARÁ (UNIDADE)',
    badge: 'PRODUTO SAZONAL',
    description: 'Mapará assado na brasa, suculento e macio (produto sazonal).',
    price: 30,
    unitType: 'UNIDADE',
    allowWeightChoice: false,
    isPopular: false,
    isAvailable: true,
    order: 3
  },
  {
    id: 'assado-tainha',
    categoryId: 'peixes-assados',
    name: 'TAINHA (UNIDADE)',
    badge: 'PRODUTO SAZONAL',
    description: 'Tainha inteira assada na brasa (produto sazonal).',
    price: 50,
    unitType: 'UNIDADE',
    allowWeightChoice: false,
    isPopular: false,
    isAvailable: true,
    order: 4
  },

  // PORÇÕES DE ACOMPANHAMENTO
  {
    id: 'acomp-arroz',
    categoryId: 'porcoes-acompanhamento',
    name: 'ARROZ BRANCO',
    description: 'Arroz soltinho e fresco.',
    price250ml: null,
    price500ml: 8,
    unitType: 'PORÇÃO',
    image: '../Fotos/delivery/Arroz.png',
    isAvailable: true,
    order: 1
  },
  {
    id: 'acomp-vinagrete',
    categoryId: 'porcoes-acompanhamento',
    name: 'VINAGRETE TRADICIONAL',
    description: 'Tomate, cebola e cheiro-verde picadinhos temperados.',
    price250ml: 8,
    price500ml: 16,
    unitType: 'PORÇÃO',
    image: '../Fotos/delivery/Vinagrete.png',
    isAvailable: true,
    order: 2
  },
  {
    id: 'acomp-farofa',
    categoryId: 'porcoes-acompanhamento',
    name: 'FAROFA CROCANTE',
    description: 'Farofa especial de soja.',
    price250ml: 8,
    price500ml: 16,
    unitType: 'PORÇÃO',
    image: '../Fotos/delivery/Farofa.png',
    isAvailable: true,
    order: 3
  },
  {
    id: 'acomp-baiao',
    categoryId: 'porcoes-acompanhamento',
    name: 'BAIÃO DE DOIS',
    description: 'Arroz cozido com feijão e tempero da casa.',
    price250ml: 8,
    price500ml: 16,
    unitType: 'PORÇÃO',
    image: '../Fotos/delivery/Baião.png',
    isAvailable: true,
    order: 4
  },
  {
    id: 'acomp-feijao',
    categoryId: 'porcoes-acompanhamento',
    name: 'FEIJÃO CASEIRO',
    description: 'Feijão bem temperado com caldo encorpado.',
    price250ml: 8,
    price500ml: 16,
    unitType: 'PORÇÃO',
    image: '../Fotos/delivery/Feijão.png',
    isAvailable: true,
    order: 5
  }
];

async function runAutoSeed() {
  try {
    // 1. Seed Config
    const configExists = await DeliveryConfig.findOne({ key: 'main' });
    if (!configExists) {
      await DeliveryConfig.create(INITIAL_CONFIG);
      console.log('✅ [Seed] Configurações iniciais do Delivery criadas.');
    }

    // 2. Seed Categorias
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      console.log(`✅ [Seed] ${INITIAL_CATEGORIES.length} categorias iniciais criadas.`);
    }

    // 3. Seed Produtos
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      for (const p of INITIAL_PRODUCTS) {
        const doc = new Product(p);
        await doc.save();
      }
      console.log(`✅ [Seed] ${INITIAL_PRODUCTS.length} produtos iniciais criados.`);
    }

    // 4. Seed Admin User padrão
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@peixariamancha.com.br';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'mancha2026';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await AdminUser.create({
        email: defaultEmail,
        name: 'Administrador Peixaria Mancha',
        passwordHash
      });
      console.log(`✅ [Seed] Usuário Admin padrão criado: ${defaultEmail}`);
    }
  } catch (err) {
    console.error('⚠️ [Seed] Erro durante auto-seed:', err.message);
  }
}

module.exports = {
  runAutoSeed,
  INITIAL_CONFIG,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS
};
