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
}

export interface DeliveryCategory {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'portion-columns';
  items: DeliveryMenuItem[];
}

export interface DeliveryCartItem {
  id: string;
  menuItemId: string;
  name: string;
  portion?: '250ml' | '500ml' | '1 KG' | '500g' | 'Unidade' | 'Banda';
  price: number;
  quantity: number;
  notes?: string;
}

export const DELIVERY_RESTAURANT_INFO = {
  name: 'PEIXARIA MANCHA',
  subtitle: 'DELIVERY RÁPIDO E SEGURO',
  tagline: 'Qualidade que você sente, sabor que você ama!',
  freshFishBadge: 'PEIXE FRESCO TODOS OS DIAS!',
  qualityGuarantee: 'QUALIDADE GARANTIDA, SABOR QUE FAZ A DIFERENÇA!',
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
    items: [
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
      },
      {
        id: 'frito-isca-dourada',
        name: 'ISCA DE DOURADA (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Iscas selecionadas de Dourada empanadas e fritas crocantes.',
        price: 74.0,
        priceFormatted: 'R$ 74,00',
        unitType: 'KG',
        allowWeightChoice: true,
      },
      {
        id: 'frito-file-dourada',
        name: 'FILÉ DE DOURADA (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Filé nobre de Dourada fresca pesado in natura.',
        price: 76.0,
        priceFormatted: 'R$ 76,00',
        unitType: 'KG',
      },
      {
        id: 'frito-pescada-amarela',
        name: 'PESCADA AMARELA (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Pescada amarela nobre de alta qualidade (pesado in natura).',
        price: 82.0,
        priceFormatted: 'R$ 82,00',
        unitType: 'KG',
        allowWeightChoice: true,
      },
      {
        id: 'frito-filhote',
        name: 'FILHOTE (KG)',
        category: 'fritos',
        badge: 'PESO IN NATURA',
        description: 'Filhote amazônico de primeira linha, super macio e saboroso.',
        price: 88.0,
        priceFormatted: 'R$ 88,00',
        unitType: 'KG',
        allowWeightChoice: true,
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
      },
    ],
  },
  {
    id: 'peixes-assados',
    title: 'PEIXES ASSADOS',
    subtitle: 'ASSADOS NA BRASA COM TEMPERO ESPECIAL',
    type: 'single',
    items: [
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
      {
        id: 'assado-tambaqui',
        name: 'TAMBAQUI A PARTIR (BANDA)',
        category: 'assados',
        badge: 'BANDA NA BRASA',
        description: 'Banda de Tambaqui assado na brasa com tempero paraense.',
        price: 100.0,
        priceFormatted: 'R$ 100,00',
        unitType: 'BANDA',
      },
      {
        id: 'assado-file-filhote',
        name: 'FILÉ DE FILHOTE (KG)',
        category: 'assados',
        badge: 'PESO IN NATURA',
        description: 'Filé nobre de Filhote assado na perfeição (peso in natura).',
        price: 90.0,
        priceFormatted: 'R$ 90,00',
        unitType: 'KG',
        allowWeightChoice: true,
      },
    ],
  },
  {
    id: 'porcoes-acompanhamento',
    title: 'PORÇÕES DE ACOMPANHAMENTO',
    subtitle: 'ESCOLHA O TAMANHO: PORÇÃO 250ML OU 500ML',
    type: 'portion-columns',
    items: [
      {
        id: 'acomp-arroz',
        name: 'ARROZ BRANCO',
        category: 'acompanhamentos',
        description: 'Arroz soltinho e fresco.',
        price500ml: 8.0,
        price500mlFormatted: 'R$ 8,00',
        unitType: 'PORÇÃO',
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
      },
      {
        id: 'acomp-farofa',
        name: 'FAROFA CROCANTE',
        category: 'acompanhamentos',
        description: 'Farofa dourada artesanal com manteiga.',
        price250ml: 8.0,
        price250mlFormatted: 'R$ 8,00',
        price500ml: 16.0,
        price500mlFormatted: 'R$ 16,00',
        unitType: 'PORÇÃO',
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
      },
    ],
  },
];
