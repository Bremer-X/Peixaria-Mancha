/**
 * @file src/data/siteData.js
 * @description Fonte única de verdade dos dados comerciais, cardápio, eventos,
 * depoimentos e galeria da Peixaria Mancha. Todos os dados originais preservados.
 */

export const RESTAURANT_META = {
  name: 'Peixaria Mancha',
  tagline: 'O verdadeiro sabor da Amazônia, preparado na hora.',
  foundedYear: 2008,
  whatsappNumber: '5591989379978',
  phoneDisplay: '(91) 98937-9978',
  secondaryWhatsapp: '5591982696928',
  address: {
    street: 'Rua Outeiro, nº 200',
    neighborhood: 'Conj. Médici II, Marambaia',
    city: 'Belém',
    state: 'PA',
    zip: '66613-455',
    reference: 'Próximo à Rodovia Augusto Montenegro',
    fullLabel: 'Rua Outeiro, nº 200 – Conj. Médici II, Marambaia – Belém/PA'
  },
  maps: {
    restaurantUrl: 'https://maps.app.goo.gl/SzozJg6TDvHHbyDy5',
    boxUrl: 'https://maps.app.goo.gl/BhnFQmixnRKVWeAX7',
    wazeUrl: 'https://waze.com/ul?q=Peixaria+Mancha+Belem',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15954.457325667649!2d-48.44874795!3d-1.4076129!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48b0001c0f0f3%3A0x67462220d220fc80!2sRestaurante%20Peixaria%20Mancha!5e0!3m2!1spt-BR!2sbr!4v1775002883234!5m2!1spt-BR!2sbr'
  },
  social: {
    instagram: 'https://www.instagram.com/peixaria.mancha/',
    instagramHandle: '@peixaria.mancha',
    facebook: 'https://www.facebook.com/profile.php?id=61566956332807'
  },
  hours: {
    timezone: 'America/Belem',
    salonLabel: 'Terça a Domingo: 11h às 20h',
    deliveryLabel: 'Segunda a Domingo: 10h às 22h (Feira/Frescos: 07h às 14h)',
    mondayNote: 'Segunda-feira o salão fecha para manutenção e abastecimento.'
  },
  chatWebhookUrl: 'https://n8n.vps7767.panel.icontainer.cloud/webhook/peixaria-mancha/chat'
};

export const DIFERENCIAIS_DATA = [
  {
    id: 'peixe-fresco',
    title: 'Peixe fresco',
    shortDesc: 'Escolha seu peixe e preparamos na hora.',
    detail: 'Tambaqui, Filhote, Dourada e Pescada Amarela selecionados na bancada, limpos e assados na brasa ou fritos no ponto exato.',
    icon: 'fish'
  },
  {
    id: 'acai-tradicional',
    title: 'Açaí tradicional',
    shortDesc: 'Puro e batido na hora.',
    detail: 'O legítimo açaí paraense, grosso e encorpado, batido no dia para acompanhar sua refeição em dose individual ou jarra.',
    icon: 'leaf'
  },
  {
    id: 'espaco-kids',
    title: 'Espaço Kids',
    shortDesc: 'Conforto para famílias.',
    detail: 'Brinquedoteca estruturada e segura nos finais de semana e feriados para que os pais aproveitem o almoço com tranquilidade.',
    icon: 'smile'
  },
  {
    id: 'estacionamento',
    title: 'Estacionamento',
    shortDesc: 'Estacionamento próprio.',
    detail: 'Vagas amplas e gratuitas em frente ao restaurante na Rua Outeiro, garantindo chegada e saída com total segurança.',
    icon: 'car'
  }
];

export const SHOWCASE_DISHES = [
  {
    id: 'feat-tambaqui',
    category: 'grelhados',
    categoryLabel: 'Na Brasa',
    name: 'Tambaqui na Brasa',
    badge: 'Especialidade da Casa',
    availability: 'Serve 2 a 4 pessoas • Fresco do dia',
    description: 'Assado na brasa no carvão com suculência incomparável, pele dourada e tempero regional. Acompanha baião de dois, farofa crocante e vinagrete.',
    priceLabel: 'R$ 160 (2p) | R$ 310 (4p)',
    priceNote: 'Opção sem espinha ou peça no peso',
    image: 'Fotos/tambaqui.jpg',
    whatsappMessage: 'Olá! Gostaria de consultar ou pedir o Tambaqui na Brasa.'
  },
  {
    id: 'feat-filhote',
    category: 'pratos-2-4',
    categoryLabel: 'Peixes Nobres',
    name: 'Filé de Filhote ("Toma Sumano")',
    badge: 'O Nobre dos Rios',
    availability: 'Opções para 2 e 4 pessoas',
    description: 'A carne mais nobre da gastronomia paraense. Filés altos, macios e sem espinhas, fritos ou na brasa, com baião de dois, farofa e vinagrete.',
    priceLabel: 'R$ 180 (2p) | R$ 310 (4p)',
    priceNote: 'Na brasa: R$ 190 (2p) | R$ 330 (4p)',
    image: 'Fotos/Feira06.jpeg',
    whatsappMessage: 'Olá! Gostaria de pedir o Filé de Filhote.'
  },
  {
    id: 'feat-dourada',
    category: 'pratos-2-4',
    categoryLabel: 'Clássico Paraense',
    name: 'Filé de Dourada ("Só o Creme")',
    badge: 'Mais Pedido',
    availability: 'Serve 2 e 4 pessoas',
    description: 'Filé de dourada tenro com tempero regional autêntico, frito na hora com crosta dourada, acompanhado de baião de dois, farofa e vinagrete.',
    priceLabel: 'R$ 140 (2p) | R$ 260 (4p)',
    priceNote: 'Acompanhamentos completos inclusos',
    image: 'Fotos/Feira02.jpeg',
    whatsappMessage: 'Olá! Gostaria de pedir o Filé de Dourada.'
  },
  {
    id: 'feat-caldeirada',
    category: 'caldeiradas',
    categoryLabel: 'Caldeiradas',
    name: 'Caldeirada Cametaense',
    badge: 'Receita de Raiz',
    availability: 'Serve 2 e 4 pessoas',
    description: 'Caldo perfumado e reconfortante preparado com peixe nobre regional, cheiro-verde, ovos cozidos, batatas, pirão consistente e arroz de chicória.',
    priceLabel: 'R$ 160 (2p) | R$ 270 (4p)',
    priceNote: 'Também disponível Caldeirada Paraense no tucupi',
    image: 'Fotos/Feira05.jpeg',
    whatsappMessage: 'Olá! Gostaria de pedir a Caldeirada Cametaense.'
  },
  {
    id: 'feat-executivo',
    category: 'executivo',
    categoryLabel: 'Almoço Executivo',
    name: 'Prato Executivo + Açaí',
    badge: 'Açaí de Cortesia',
    availability: 'Terça a Sexta (exceto feriados)',
    description: 'Ideal para o almoço durante a semana: filé de peixe frito na hora ou picanha na brasa, arroz, baião, farofa, vinagrete e açaí batido na hora.',
    priceLabel: 'A partir de R$ 40',
    priceNote: 'Opções: Gó, Dourada, Filhote, Pescada, Pirarucu, Picanha',
    image: 'Fotos/Executivo.jpg',
    whatsappMessage: 'Olá! Gostaria de ver as opções de Pratos Executivos.'
  },
  {
    id: 'feat-petiscos',
    category: 'entradas',
    categoryLabel: 'Entradas & Petiscos',
    name: 'Iscas & Entradas Regionais',
    badge: 'Para Compartilhar',
    availability: 'Porções preparadas na hora',
    description: 'Pipoquinha de Dourada crocante, Camarão Empanado, Camarão no Bafo e Casquinha de Caranguejo para começar bem o almoço.',
    priceLabel: 'R$ 15 a R$ 50',
    priceNote: 'Perfeito para compartilhar com a família',
    image: 'Fotos/Executivo02.jpg',
    whatsappMessage: 'Olá! Gostaria de pedir porções e entradas.'
  }
];

export const MENU_CATEGORIES = [
  {
    id: 'pratos-2-4',
    title: 'Pratos para 2 e 4 Pessoas',
    subtitle: 'Todos acompanham baião ou feijão, arroz, vinagrete e farofa',
    items: [
      { name: 'Só o Creme — Filé de Dourada', description: 'Filé de dourada frito na hora com acompanhamentos completos.', price2p: 'R$ 140', price4p: 'R$ 260', availability: 'Terça a Domingo' },
      { name: 'Rapidola — Isca de Dourada', description: 'Iscas selecionadas de dourada empanadas e crocantes.', price2p: 'R$ 140', price4p: 'R$ 260', availability: 'Terça a Domingo' },
      { name: 'Sem Pavulagem — Filé de Gó', description: 'Filé de gó macio e sequinho no ponto certo.', price2p: 'R$ 110', price4p: 'R$ 190', availability: 'Terça a Domingo' },
      { name: 'Não Te Afoba — Camarão Guisado', description: 'Camarão regional guisado no tempero paraense.', price2p: 'R$ 120', price4p: null, availability: 'Terça a Domingo' },
      { name: 'Toma-lhe-te — Filé de Pescada Amarela', description: 'Filé nobre de pescada amarela dourado e suculento.', price2p: 'R$ 170', price4p: 'R$ 270', availability: 'Terça a Domingo' },
      { name: 'Não é Pão — Pirarucu', description: 'Postas nobres do gigante da Amazônia preparadas na hora.', price2p: 'R$ 170', price4p: 'R$ 270', availability: 'Terça a Domingo' },
      { name: 'Toma Sumano — Filé de Filhote', description: 'Corte alto de filhote amazônico sem espinhas.', price2p: 'R$ 180', price4p: 'R$ 310', availability: 'Terça a Domingo' },
      { name: 'Charque com Açaí', description: 'Charque frito acebolado acompanhado de açaí tradicional.', price2p: 'R$ 180', price4p: null, availability: 'Terça a Domingo' },
      { name: 'Combo Tô Brocado (Serve 6 Pessoas)', description: 'Gó 200g, Dourada 100g, Filhote 100g, Pirarucu 200g, Pescada 200g + 2 jarras de Açaí ou suco.', priceSingle: 'R$ 420', badge: 'Combo Família 6p', availability: 'Terça a Domingo' }
    ]
  },
  {
    id: 'caldeiradas',
    title: 'Caldeiradas & Moquecas',
    subtitle: 'De Filhote ou Pescada Amarela • Acompanham arroz de chicória e pirão',
    items: [
      { name: 'Caldeirada Cametaense', description: 'Peixe nobre no caldo regional com ovos, batatas, cheiro-verde, arroz de chicória e pirão.', price2p: 'R$ 160', price4p: 'R$ 270', availability: 'Terça a Domingo' },
      { name: 'Caldeirada Paraense', description: 'Peixe banhado no tucupi, jambu, patas de caranguejo e camarão, arroz de chicória e pirão.', price2p: 'R$ 190', price4p: 'R$ 330', availability: 'Terça a Domingo' },
      { name: 'Moqueca à Moda do Mancha', description: 'Peixe banhado no leite de coco com patas de caranguejo, camarão, arroz de chicória e pirão.', price2p: 'R$ 210', price4p: 'R$ 390', availability: 'Terça a Domingo' }
    ]
  },
  {
    id: 'grelhados',
    title: 'Grelhados na Brasa',
    subtitle: 'Peso dos produtos in natura • Acompanham baião, farofa e vinagrete',
    items: [
      { name: 'Filhote na Brasa', description: 'Filhote assado no carvão mantendo toda a suculência.', price2p: 'R$ 190', price4p: 'R$ 330', availability: 'Terça a Domingo' },
      { name: 'Tambaqui sem Espinha', description: 'Banda de tambaqui assada na brasa sem espinhas.', price2p: 'R$ 160', price4p: 'R$ 310', availability: 'Terça a Domingo' },
      { name: 'Cametá (Mapará Assado)', description: 'Tradicional mapará assado na brasa.', price2p: 'R$ 50', price4p: null, availability: 'Terça a Domingo' },
      { name: 'Picanha com Fritas', description: 'Picanha selecionada grelhada na brasa com batatas fritas.', price2p: 'R$ 160', price4p: 'R$ 280', availability: 'Terça a Domingo' }
    ]
  },
  {
    id: 'executivo',
    title: 'Pratos Executivos',
    subtitle: 'Disponíveis de Terça a Sexta (exceto feriados) • Acompanham arroz, baião, vinagrete e farofa',
    items: [
      { name: 'Filé de Gó (Frito)', description: 'Individual completo com acompanhamentos.', priceSingle: 'R$ 40', availability: 'Terça a Sexta' },
      { name: 'Espetão na Brasa', description: 'Individual completo grelhado na brasa.', priceSingle: 'R$ 40', availability: 'Terça a Sexta' },
      { name: 'Filé de Dourada (Frita)', description: 'Individual completo com filé de dourada.', priceSingle: 'R$ 45', availability: 'Terça a Sexta' },
      { name: 'Filé de Pescada (Frito)', description: 'Individual completo com filé de pescada amarela.', priceSingle: 'R$ 55', availability: 'Terça a Sexta' },
      { name: 'Filé de Filhote (Frita)', description: 'Individual completo com filé de filhote.', priceSingle: 'R$ 55', availability: 'Terça a Sexta' },
      { name: 'Picanha Assada de Brasa', description: 'Individual completo com picanha na brasa.', priceSingle: 'R$ 55', availability: 'Terça a Sexta' },
      { name: 'Filé de Pirarucu Salgado (Frito)', description: 'Individual completo com pirarucu regional.', priceSingle: 'R$ 60', availability: 'Terça a Sexta' },
      { name: 'Charque (Frito)', description: 'Individual completo com charque acebolado.', priceSingle: 'R$ 60', availability: 'Terça a Sexta' },
      { name: 'Camarão Regional Guisado', description: 'Individual completo com camarão regional.', priceSingle: 'R$ 60', availability: 'Terça a Sexta' }
    ]
  },
  {
    id: 'entradas',
    title: 'Entradas & Porções Extras',
    subtitle: 'Petiscos fritos na hora e acompanhamentos adicionais',
    items: [
      { name: 'Batata Frita', description: 'Porção crocante (acompanha molho rosé).', priceSingle: 'R$ 15', availability: 'Sempre disponível' },
      { name: 'Pipoquinha de Dourada', description: 'Cubos de filé de dourada empanados e crocantes.', priceSingle: 'R$ 40', availability: 'Sempre disponível' },
      { name: 'Bolinho Recheado', description: 'Bolinho artesanal com massa de macaxeira.', priceSingle: 'R$ 40', availability: 'Sempre disponível' },
      { name: 'Casquinha de Caranguejo', description: 'Carne de caranguejo temperada e gratinada.', priceSingle: 'R$ 50', availability: 'Sempre disponível' },
      { name: 'Camarão Empanado', description: 'Camarões crocantes (opção com requeijão ou jambu).', priceSingle: 'R$ 50', availability: 'Sempre disponível' },
      { name: 'Camarão no Bafo', description: 'Camarão regional preparado no alho e ervas.', priceSingle: 'R$ 50', availability: 'Sempre disponível' },
      { name: 'Porções Extras (Arroz, Farofa, Vinagrete ou Feijão)', description: 'Porção adicional para a mesa.', priceSingle: 'R$ 10', availability: 'Sempre disponível' },
      { name: 'Porções Extras (Baião de Dois ou Pirão)', description: 'Porção adicional cremosa feita na hora.', priceSingle: 'R$ 15', availability: 'Sempre disponível' }
    ]
  },
  {
    id: 'acai-bebidas',
    title: 'Açaí, Sobremesas & Bebidas',
    subtitle: 'Açaí batido na hora, sucos da fruta, refrigerantes e cervejas geladas',
    items: [
      { name: 'Açaí Tradicional — Dose 300ml', description: 'Puro e batido na hora.', priceSingle: 'R$ 20', availability: 'Batido no dia' },
      { name: 'Açaí Tradicional — Jarra 1L', description: 'Jarra família batida na hora.', priceSingle: 'R$ 50', availability: 'Batido no dia' },
      { name: 'Sorvete na Taça / Picolé', description: 'Sobremesas refrescantes (Picolé R$ 10 | Taça R$ 20).', priceSingle: 'R$ 10 / R$ 20', availability: 'Sempre disponível' },
      { name: 'Sucos Naturais 340ml (Cupuaçu, Manga, Goiaba)', description: 'Polpa natural da fruta.', priceSingle: 'R$ 10', availability: 'Sempre disponível' },
      { name: 'Sucos 340ml (Morango, Laranja, Limonada) / Jarra', description: 'Copo 340ml R$ 12 | Jarra de Suco R$ 40.', priceSingle: 'R$ 12 / R$ 40', availability: 'Sempre disponível' },
      { name: 'Cervejas 600ml (Devassa, Amstel, Eisenbahn, Heineken, Baden)', description: 'Servidas estupidamente geladas na mesa.', priceSingle: 'R$ 13 a R$ 23', availability: 'Sempre disponível' },
      { name: 'Long Neck 330ml (Heineken, 0.0, Praya, Amstel Ultra, Corona, Bud, Ice)', description: 'Opções com e sem álcool / sem glúten.', priceSingle: 'R$ 10 a R$ 12', availability: 'Sempre disponível' },
      { name: 'Refrigerantes & Águas (Água, FYZ, Guaraná, Coca-Cola, H2OH)', description: 'Lata, KS, 600ml e 1 Litro.', priceSingle: 'R$ 5 a R$ 14', availability: 'Sempre disponível' }
    ]
  }
];
