export interface MenuItem {
  id: string;
  name: string;
  preparation?: string; // e.g., 'FRITO', 'BRASA'
  description?: string; // e.g., '(com molho rosé)', '(arroz de chicória e pirão)'
  price?: number; // for single-price items
  priceFormatted?: string; // e.g., 'R$ 15,00'
  price2P?: number;
  price2PFormatted?: string;
  price4P?: number;
  price4PFormatted?: string;
  badge?: string; // e.g., 'O MAIS PEDIDO!'
  serves?: string; // e.g., 'SERVE 6 PESSOAS'
  isSpecialCombo?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'portion-columns' | 'grid';
  items: MenuItem[];
  footerNote?: string;
}

export interface CartItem {
  id: string; // unique item id + portion
  menuItemId: string;
  name: string;
  portion?: '2P' | '4P' | 'Individual';
  price: number;
  quantity: number;
  notes?: string;
  sideChoice?: string; // e.g., 'Baião de Dois' | 'Feijão'
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  orderType: 'delivery' | 'pickup';
  address: string;
  referencePoint: string;
  paymentMethod: 'pix' | 'credit' | 'debit' | 'cash';
  cashChangeFor?: string;
  generalNotes: string;
}
