import { MenuCategory } from '../types';

export const RESTAURANT_INFO = {
  name: 'PEIXARIA MANCHA',
  tagline: 'TRADIÇÃO PARAENSE & PEIXES DE PRIMEIRA',
  qualityBadge: 'QUALIDADE GARANTIDA!',
  whatsapp: '5591982696928',
  phoneFormatted: '(91) 98269-6928',
  freshFishBadge: 'PEIXE FRESCO TODO DIA!',
  freshFishDesc: 'Garantia de sabor autêntico e qualidade em cada porção.',
  legalWarning: 'DEVASSA • PEGA LEVE NA BEBIDA :) • Venda e consumo proibidos para menores de 18 anos (+18).'
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'entradas',
    title: 'ENTRADAS',
    type: 'single',
    items: [
      {
        id: 'ent-1',
        name: 'BATATA FRITA',
        description: '(com molho rosé)',
        price: 15.0,
        priceFormatted: 'R$ 15,00'
      },
      {
        id: 'ent-2',
        name: 'PIPOQUINHA DE DOURADA',
        price: 40.0,
        priceFormatted: 'R$ 40,00'
      },
      {
        id: 'ent-3',
        name: 'BOLINHO RECHEADO',
        description: '(massa de macaxeira)',
        price: 40.0,
        priceFormatted: 'R$ 40,00'
      },
      {
        id: 'ent-4',
        name: 'CAMARÃO NO BAFO',
        price: 50.0,
        priceFormatted: 'R$ 50,00'
      },
      {
        id: 'ent-5',
        name: 'CAMARÃO EMPANADO',
        description: '(requeijão ou jambu)',
        price: 50.0,
        priceFormatted: 'R$ 50,00'
      },
      {
        id: 'ent-6',
        name: 'CASQUINHA DE CARANGUEJO',
        price: 50.0,
        priceFormatted: 'R$ 50,00'
      }
    ]
  },
  {
    id: 'executivo',
    title: 'PRATOS EXECUTIVO',
    subtitle: '(Somente de Segunda a Sexta, exceto feriados)',
    type: 'single',
    footerNote: 'TODOS ACOMPANHAM BAIÃO OU FEIJÃO, FAROFA E VINAGRETE.',
    items: [
      {
        id: 'exec-1',
        name: 'FILÉ DE GÓ',
        preparation: 'FRITO',
        price: 40.0,
        priceFormatted: 'R$ 40,00'
      },
      {
        id: 'exec-2',
        name: 'ESPETÃO',
        preparation: 'BRASA',
        price: 40.0,
        priceFormatted: 'R$ 40,00'
      },
      {
        id: 'exec-3',
        name: 'FILÉ DE DOURADA',
        preparation: 'FRITO',
        price: 45.0,
        priceFormatted: 'R$ 45,00'
      },
      {
        id: 'exec-4',
        name: 'FILÉ DE PESCADA',
        preparation: 'FRITO',
        price: 55.0,
        priceFormatted: 'R$ 55,00'
      },
      {
        id: 'exec-5',
        name: 'FILÉ DE FILHOTE',
        preparation: 'FRITO',
        price: 55.0,
        priceFormatted: 'R$ 55,00'
      },
      {
        id: 'exec-6',
        name: 'PICANHA NA BRASA',
        price: 55.0,
        priceFormatted: 'R$ 55,00'
      },
      {
        id: 'exec-7',
        name: 'PIRARUCU SALGADO',
        preparation: 'FRITO',
        price: 60.0,
        priceFormatted: 'R$ 60,00'
      },
      {
        id: 'exec-8',
        name: 'CHARQUE ACEBOLADO',
        preparation: 'FRITO',
        price: 60.0,
        priceFormatted: 'R$ 60,00'
      },
      {
        id: 'exec-9',
        name: 'CAMARÃO REGIONAL GUISADO',
        price: 60.0,
        priceFormatted: 'R$ 60,00'
      }
    ]
  },
  {
    id: 'pratos-2-4',
    title: 'PRATOS PARA 2 E 4 PESSOAS (FRITO)',
    type: 'portion-columns',
    items: [
      {
        id: 'p24-1',
        name: 'SEM PAVULAGEM',
        description: '(filé de gó)',
        price2P: 110.0,
        price2PFormatted: 'R$ 110,00',
        price4P: 190.0,
        price4PFormatted: 'R$ 190,00'
      },
      {
        id: 'p24-2',
        name: 'NÃO TE AFOBA',
        description: '(camarão guisado)',
        price2P: 120.0,
        price2PFormatted: 'R$ 120,00'
      },
      {
        id: 'p24-3',
        name: 'RAPIDOLA',
        description: '(isca de dourada)',
        price2P: 140.0,
        price2PFormatted: 'R$ 140,00',
        price4P: 260.0,
        price4PFormatted: 'R$ 260,00'
      },
      {
        id: 'p24-4',
        name: 'SÓ O CREME',
        description: '(filé de dourada)',
        price2P: 140.0,
        price2PFormatted: 'R$ 140,00',
        price4P: 260.0,
        price4PFormatted: 'R$ 260,00'
      },
      {
        id: 'p24-5',
        name: 'TOMA-LHE-TE',
        description: '(filé de pescada amarela)',
        price2P: 170.0,
        price2PFormatted: 'R$ 170,00',
        price4P: 270.0,
        price4PFormatted: 'R$ 270,00'
      },
      {
        id: 'p24-6',
        name: 'NÃO, É PÃO',
        description: '(pirarucu)',
        price2P: 170.0,
        price2PFormatted: 'R$ 170,00',
        price4P: 270.0,
        price4PFormatted: 'R$ 270,00'
      },
      {
        id: 'p24-7',
        name: 'TOMA SUMANO',
        description: '(filé filhote)',
        price2P: 180.0,
        price2PFormatted: 'R$ 180,00',
        price4P: 310.0,
        price4PFormatted: 'R$ 310,00'
      },
      {
        id: 'p24-8',
        name: 'CHARQUE C/ AÇAÍ',
        price2P: 180.0,
        price2PFormatted: 'R$ 180,00'
      },
      {
        id: 'p24-combo',
        name: 'TÓ BROCADO',
        description: '(filé de gó, pirarucu, dourada, filhote, pescada amarela) + 2 jarras de açaí ou suco.',
        badge: '★ O MAIS PEDIDO!',
        serves: 'SERVE 6 PESSOAS',
        price: 420.0,
        priceFormatted: 'R$ 420,00',
        isSpecialCombo: true
      }
    ]
  },
  {
    id: 'caldeiradas',
    title: 'CALDEIRADAS',
    subtitle: '(De Filhote ou Pescada Amarela)',
    type: 'portion-columns',
    items: [
      {
        id: 'cald-1',
        name: 'CALDEIRADA CAMETAENSE',
        description: '(arroz de chicória e pirão)',
        price2P: 160.0,
        price2PFormatted: 'R$ 160,00',
        price4P: 270.0,
        price4PFormatted: 'R$ 270,00'
      },
      {
        id: 'cald-2',
        name: 'CALDEIRADA PARAENSE',
        description: '(peixe banhado no tucupi, jambu, patas de caranguejo e camarão, arroz de chicória e pirão)',
        price2P: 190.0,
        price2PFormatted: 'R$ 190,00',
        price4P: 330.0,
        price4PFormatted: 'R$ 330,00'
      },
      {
        id: 'cald-3',
        name: 'MOQUECA A MODA DO MANCHA',
        description: '(peixe banhado no leite de coco com patas de caranguejo, camarão arroz de chicória e pirão)',
        price2P: 210.0,
        price2PFormatted: 'R$ 210,00',
        price4P: 390.0,
        price4PFormatted: 'R$ 390,00'
      }
    ]
  },
  {
    id: 'grelhados',
    title: 'GRELHADOS',
    type: 'portion-columns',
    items: [
      {
        id: 'grelh-1',
        name: 'CAMETÁ',
        description: '(mapará assado)',
        price2P: 50.0,
        price2PFormatted: 'R$ 50,00'
      },
      {
        id: 'grelh-2',
        name: 'PICANHA C/ FRITAS',
        price2P: 160.0,
        price2PFormatted: 'R$ 160,00',
        price4P: 280.0,
        price4PFormatted: 'R$ 280,00'
      },
      {
        id: 'grelh-3',
        name: 'TAMBAQUI SEM ESPINHA',
        price2P: 160.0,
        price2PFormatted: 'R$ 160,00',
        price4P: 310.0,
        price4PFormatted: 'R$ 310,00'
      },
      {
        id: 'grelh-4',
        name: 'FILHOTE NA BRASA',
        price2P: 190.0,
        price2PFormatted: 'R$ 190,00',
        price4P: 330.0,
        price4PFormatted: 'R$ 330,00'
      }
    ]
  },
  {
    id: 'porcoes-extras',
    title: 'PORÇÕES EXTRAS',
    type: 'grid',
    items: [
      { id: 'ext-1', name: 'ARROZ', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ext-2', name: 'FEIJÃO', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ext-3', name: 'FAROFA', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ext-4', name: 'PIRÃO', price: 15.0, priceFormatted: 'R$ 15,00' },
      { id: 'ext-5', name: 'VINAGRETE', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ext-6', name: 'BAIÃO', price: 15.0, priceFormatted: 'R$ 15,00' }
    ]
  },
  {
    id: 'acai',
    title: 'AÇAÍ',
    type: 'single',
    items: [
      { id: 'acai-1', name: 'DOSE 300 ML', price: 20.0, priceFormatted: 'R$ 20,00' },
      { id: 'acai-2', name: 'JARRA 1L', price: 50.0, priceFormatted: 'R$ 50,00' }
    ]
  },
  {
    id: 'sobremesas',
    title: 'SOBREMESAS',
    type: 'single',
    items: [
      { id: 'sob-1', name: 'PICOLÉ', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'sob-2', name: 'SORVETE NA TAÇA', price: 20.0, priceFormatted: 'R$ 20,00' }
    ]
  },
  {
    id: 'cervejas-600',
    title: 'CERVEJAS 600ML',
    type: 'single',
    items: [
      { id: 'cer-1', name: 'BADEN BADEN 600 ML', price: 23.0, priceFormatted: 'R$ 23,00' },
      { id: 'cer-2', name: 'HEINEKEN 600 ML', price: 20.0, priceFormatted: 'R$ 20,00' },
      { id: 'cer-3', name: 'EISENBAHN 600 ML', price: 16.0, priceFormatted: 'R$ 16,00' },
      { id: 'cer-4', name: 'AMSTEL 600 ML', price: 15.0, priceFormatted: 'R$ 15,00' },
      { id: 'cer-5', name: 'DEVASSA 600 ML', price: 13.0, priceFormatted: 'R$ 13,00' }
    ]
  },
  {
    id: 'long-neck',
    title: 'LONG NECK 330ML',
    type: 'single',
    items: [
      { id: 'ln-1', name: 'HEINEKEN', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ln-2', name: 'HEINEKEN 0.0', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ln-3', name: 'PRAYA', description: '(Puro Malte Sem Glúten)', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ln-4', name: 'AMSTEL ULTRA', description: '(Puro Malte Sem Glúten)', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ln-5', name: 'CORONA', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ln-6', name: 'CERPINHA', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ln-7', name: 'BUDWEISER', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ln-8', name: 'ICE', price: 12.0, priceFormatted: 'R$ 12,00' }
    ]
  },
  {
    id: 'refrigerantes',
    title: 'REFRIGERANTES & ÁGUAS',
    type: 'single',
    items: [
      {
        id: 'ref-1',
        name: 'FYZ',
        description: '(Refrigerante Grupo Heineken - 50% menos açúcar)',
        price: 7.0,
        priceFormatted: 'R$ 7,00'
      },
      { id: 'ref-2', name: 'FYZ ZERO', price: 7.0, priceFormatted: 'R$ 7,00' },
      { id: 'ref-3', name: 'ÁGUA SEM GÁS', price: 5.0, priceFormatted: 'R$ 5,00' },
      { id: 'ref-4', name: 'ÁGUA COM GÁS', price: 6.0, priceFormatted: 'R$ 6,00' },
      { id: 'ref-5', name: 'GUARANÁ LATA / ZERO LATA', price: 7.0, priceFormatted: 'R$ 7,00' },
      { id: 'ref-6', name: 'GUARANÁ 1L', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'ref-7', name: 'COCA ZERO LATA', price: 7.0, priceFormatted: 'R$ 7,00' },
      { id: 'ref-8', name: 'COCA LATA NORMAL', price: 8.0, priceFormatted: 'R$ 8,00' },
      { id: 'ref-9', name: 'COCA KS', price: 7.0, priceFormatted: 'R$ 7,00' },
      { id: 'ref-10', name: 'SCHWEPPES LATA', price: 7.0, priceFormatted: 'R$ 7,00' },
      { id: 'ref-11', name: 'COCA 600ML PET / ZERO', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'ref-12', name: 'COCA 1L VIDRO / ZERO', price: 14.0, priceFormatted: 'R$ 14,00' },
      { id: 'ref-13', name: 'H2OH LIMÃO / LIMONETO', price: 8.0, priceFormatted: 'R$ 8,00' }
    ]
  },
  {
    id: 'sucos',
    title: 'SUCO 340 ML',
    type: 'single',
    items: [
      { id: 'suc-1', name: 'MANGA, GOIABA, CUPUAÇU', price: 10.0, priceFormatted: 'R$ 10,00' },
      { id: 'suc-2', name: 'MORANGO, LARANJA, LIMONADA', price: 12.0, priceFormatted: 'R$ 12,00' },
      { id: 'suc-3', name: 'JARRA DE SUCO', price: 40.0, priceFormatted: 'R$ 40,00' }
    ]
  }
];
