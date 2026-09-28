export interface DeliveryMenuItem {
  id: string;
  name: string;
  category: 'fritos' | 'assados' | 'acompanhamentos';
  badge?: string; // e.g., 'PESO IN NATURA', 'UNIDADE', 'SAZONAL'
  description?: string;
  price?: number;
  priceFormatted?: string;
  price250ml?: number;
  price250mlFormatted?: string;
  price500ml?: number;
  price500mlFormatted?: string;
  unitType?: 'KG' | 'UNIDADE' | 'BANDA' | 'PORÇÃO';
  /** Quando true, o modal exibe a escolha entre 1 KG e 500g */
  allowWeightChoice?: boolean;
  image?: string;
  isPopular?: boolean;
  serves?: string;
}

export interface DeliveryCategory {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'portion-columns';
  iconName?: 'Fish' | 'Flame' | 'Utensils';
  items: DeliveryMenuItem[];
}

export interface DeliveryCartItem {
  id: string;
  menuItemId: string;
  name: string;
  portion?: string;
  price: number;
  quantity: number;
  notes?: string;
  image?: string;
}

export const DELIVERY_HOURS = {
  openHour: 7,
  closeHour: 14,
  label: 'Todos os dias das 07h às 14h',
};

export function getDeliveryAvailability() {
  try {
    const now = new Date();
    // Timezone Belém (UTC-3)
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Belem',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const currentMinutes = hour * 60 + minute;

    const openMinutes = DELIVERY_HOURS.openHour * 60; // 07:00 (420 min)
    const closeMinutes = DELIVERY_HOURS.closeHour * 60; // 14:00 (840 min)

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    return {
      isOpen,
      statusText: isOpen ? 'Aberto para Pedidos' : 'Fechado no momento',
      subText: isOpen ? '30-50 min' : 'Disponível das 07h às 14h',
      scheduleText: 'Todos os dias das 07h às 14h',
    };
  } catch {
    const hour = new Date().getHours();
    const isOpen = hour >= 7 && hour < 14;
    return {
      isOpen,
      statusText: isOpen ? 'Aberto para Pedidos' : 'Fechado no momento',
      subText: isOpen ? '30-50 min' : 'Disponível das 07h às 14h',
      scheduleText: 'Todos os dias das 07h às 14h',
    };
  }
}

export const DELIVERY_RESTAURANT_INFO = {
  name: 'PEIXARIA MANCHA',
  subtitle: 'DELIVERY RÁPIDO E SEGURO',
  tagline: 'Qualidade que você sente, sabor que você ama!',
  freshFishBadge: 'PEIXE FRESCO TODOS OS DIAS!',
  qualityGuarantee: 'QUALIDADE GARANTIDA, SABOR QUE FAZ A DIFERENÇA!',
  statusText: 'Aberto para Pedidos',
  deliveryTime: '30-50 min',
  location: 'Belém & Ananindeua',
  whatsapp: '5591989379978',
  phoneFormatted: '(91) 98937-9978',
  instagram: '@peixaria.mancha',
  instagramUrl: 'https://instagram.com/peixaria.mancha',
};

export const DELIVERY_MENU_CATEGORIES: DeliveryCategory[] = [
  {
    id: 'peixes-fritos',
    title: 'PEIXES FRITOS',
    subtitle: 'PRODUTOS PESADOS IN NATURA',
    type: 'single',
    iconName: 'Fish',
    items: [
      {
        id: 'frito-file-filhote',
        name: 'FILÉ DE FILHOTE FRITO (KG)',
        category: 'fritos',
        badge: 'FRITO CROCANTE',
        description: 'Filé nobre de Filhote amazônico frito crocante e sequinho por fora, macio e suculento por dentro (peso in natura).',
        price: 88.0,
        priceFormatted: 'R$ 88,00',
        unitType: 'KG',
        allowWeightChoice: true,
        isPopular: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'frito-file-dourada',
        name: 'FILÉ DE DOURADA (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Filé nobre de Dourada fresca empanada crocante.',
        price: 76.0,
        priceFormatted: 'R$ 76,00',
        unitType: 'KG',
        allowWeightChoice: true,
        isPopular: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'frito-isca-dourada',
        name: 'ISCA DE DOURADA (KG)',
        category: 'fritos',
        badge: 'PETISCO CAMPEÃO',
        description: 'Iscas selecionadas de Dourada fresca, crocantes e douradas.',
        price: 74.0,
        priceFormatted: 'R$ 74,00',
        unitType: 'KG',
        allowWeightChoice: true,
        isPopular: true,
        serves: 'Porção generosa',
      },
      {
        id: 'frito-pescada-amarela',
        name: 'PESCADA AMARELA (KG)',
        category: 'fritos',
        badge: 'ESPECIALIDADE',
        description: 'Pescada amarela nobre de alta qualidade (pesado in natura).',
        price: 82.0,
        priceFormatted: 'R$ 82,00',
        unitType: 'KG',
        allowWeightChoice: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'frito-file-go',
        name: 'FILÉ DE GÓ (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Filé de Gó fresco e frito no capricho (pesado in natura).',
        price: 74.0,
        priceFormatted: 'R$ 74,00',
        unitType: 'KG',
        allowWeightChoice: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'frito-pirarucu',
        name: 'PIRARUCU FRESCO (KG)',
        category: 'fritos',
        badge: 'PRODUTO SAZONAL',
        description: 'Pirarucu fresco da Amazônia (produto sazonal, pesado in natura).',
        price: 85.0,
        priceFormatted: 'R$ 85,00',
        unitType: 'KG',
        allowWeightChoice: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'frito-go-inteira',
        name: 'GÓ INTEIRA (UNIDADE)',
        category: 'fritos',
        badge: 'UNIDADE',
        description: 'Gó inteira frita sequinha e crocante.',
        price: 10.0,
        priceFormatted: 'R$ 10,00',
        unitType: 'UNIDADE',
        serves: 'Individual',
      },
    ],
  },
  {
    id: 'peixes-assados',
    title: 'PEIXES ASSADOS',
    subtitle: 'ASSADOS NA BRASA COM TEMPERO ESPECIAL',
    type: 'single',
    iconName: 'Flame',
    items: [
      {
        id: 'assado-tambaqui',
        name: 'TAMBAQUI A PARTIR (BANDA)',
        category: 'assados',
        badge: 'BRASA PARAENSE',
        description: 'Banda nobre de Tambaqui assado na brasa, suculento e dourado.',
        price: 100.0,
        priceFormatted: 'R$ 100,00',
        unitType: 'BANDA',
        isPopular: true,
        serves: 'Serve 3 a 4 pessoas',
      },
      {
        id: 'assado-file-filhote',
        name: 'FILÉ DE FILHOTE ASSADO (KG)',
        category: 'assados',
        badge: 'ASSADO NA BRASA',
        description: 'Filé nobre de Filhote assado na brasa com tempero especial da casa, textura macia e sabor defumado incomparável (peso in natura).',
        price: 90.0,
        priceFormatted: 'R$ 90,00',
        unitType: 'KG',
        allowWeightChoice: true,
        isPopular: true,
        serves: 'Até 3 pessoas',
      },
      {
        id: 'assado-mapara',
        name: 'MAPARÁ (UNIDADE)',
        category: 'assados',
        badge: 'PRODUTO SAZONAL',
        description: 'Mapará assado na brasa, suculento e macio (produto sazonal).',
        price: 30.0,
        priceFormatted: 'R$ 30,00',
        unitType: 'UNIDADE',
      },
      {
        id: 'assado-tainha',
        name: 'TAINHA (UNIDADE)',
        category: 'assados',
        badge: 'PRODUTO SAZONAL',
        description: 'Tainha inteira assada na brasa (produto sazonal).',
        price: 50.0,
        priceFormatted: 'R$ 50,00',
        unitType: 'UNIDADE',
      },
    ],
  },
  {
    id: 'porcoes-acompanhamento',
    title: 'PORÇÕES DE ACOMPANHAMENTO',
    subtitle: 'ESCOLHA O TAMANHO: PORÇÃO 250g OU 500g',
    type: 'portion-columns',
    iconName: 'Utensils',
    items: [
      {
        id: 'acomp-arroz',
        name: 'ARROZ BRANCO',
        category: 'acompanhamentos',
        description: 'Arroz soltinho e fresco.',
        price500ml: 8.0,
        price500mlFormatted: 'R$ 8,00',
        unitType: 'PORÇÃO',
        image: '../Fotos/delivery/Arroz.png',
      },
      {
        id: 'acomp-vinagrete',
        name: 'VINAGRETE TRADICIONAL',
        category: 'acompanhamentos',
        description: 'Tomate, cebola e cheiro-verde picadinhos temperados.',
        price250ml: 8.0,
        price250mlFormatted: 'R$ 8,00',
        price500ml: 16.0,
        price500mlFormatted: 'R$ 16,00',
        unitType: 'PORÇÃO',
        image: '../Fotos/delivery/Vinagrete.png',
      },
      {
        id: 'acomp-farofa',
        name: 'FAROFA CROCANTE',
        category: 'acompanhamentos',
        description: 'Farofa especial de soja.',
        price250ml: 8.0,
        price250mlFormatted: 'R$ 8,00',
        price500ml: 16.0,
        price500mlFormatted: 'R$ 16,00',
        unitType: 'PORÇÃO',
        image: '../Fotos/delivery/Farofa.png',
      },
      {
        id: 'acomp-baiao',
        name: 'BAIÃO DE DOIS',
        category: 'acompanhamentos',
        description: 'Arroz cozido com feijão e tempero da casa.',
        price250ml: 8.0,
        price250mlFormatted: 'R$ 8,00',
        price500ml: 16.0,
        price500mlFormatted: 'R$ 16,00',
        unitType: 'PORÇÃO',
        image: '../Fotos/delivery/Baião.png',
      },
      {
        id: 'acomp-feijao',
        name: 'FEIJÃO CASEIRO',
        category: 'acompanhamentos',
        description: 'Feijão bem temperado com caldo encorpado.',
        price250ml: 8.0,
        price250mlFormatted: 'R$ 8,00',
        price500ml: 16.0,
        price500mlFormatted: 'R$ 16,00',
        unitType: 'PORÇÃO',
        image: '../Fotos/delivery/Feijão.png',
      },
    ],
  },
];
