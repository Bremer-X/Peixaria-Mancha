import { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, MapPin, Store, CreditCard, Banknote, QrCode } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    phone: '',
    orderType: 'delivery',
    address: '',
    referencePoint: '',
    paymentMethod: 'pix',
    cashChangeFor: '',
    generalNotes: '',
  });

  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendWhatsApp = () => {
    if (cart.length === 0) {
      setValidationError('Seu pedido está vazio.');
      return;
    }

    if (!orderDetails.customerName.trim()) {
      setValidationError('Por favor, informe seu nome.');
      return;
    }

    if (orderDetails.orderType === 'delivery' && !orderDetails.address.trim()) {
      setValidationError('Por favor, informe seu endereço de entrega.');
      return;
    }

    setValidationError('');

    // Format WhatsApp Message
    let message = `🐟 *NOVO PEDIDO - PEIXARIA MANCHA*\n`;
    message += `──────────────────────\n`;
    message += `👤 *Cliente:* ${orderDetails.customerName.trim()}\n`;
    if (orderDetails.phone.trim()) {
      message += `📱 *Telefone:* ${orderDetails.phone.trim()}\n`;
    }
    message += `🛵 *Tipo:* ${orderDetails.orderType === 'delivery' ? 'ENTREGA (DELIVERY)' : 'RETIRADA NO LOCAL'}\n`;

    if (orderDetails.orderType === 'delivery') {
      message += `📍 *Endereço:* ${orderDetails.address.trim()}\n`;
      if (orderDetails.referencePoint.trim()) {
        message += `🏷️ *Ponto de Ref.:* ${orderDetails.referencePoint.trim()}\n`;
      }
    }

    message += `──────────────────────\n`;
    message += `📋 *ITENS DO PEDIDO:*\n`;

    cart.forEach((item, index) => {
      message += `\n${index + 1}. *${item.quantity}x ${item.name}*`;
      if (item.portion) {
        message += ` (${item.portion})`;
      }
      message += `\n   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;

      if (item.sideChoice) {
        message += `\n   Acompanhamento: ${item.sideChoice}`;
      }
      if (item.notes) {
        message += `\n   Obs: ${item.notes}`;
      }
    });

    message += `\n\n──────────────────────\n`;
    message += `💰 *TOTAL: R$ ${subtotal.toFixed(2).replace('.', ',')}*\n`;

    // Payment Info
    let paymentLabel = 'PIX';
    if (orderDetails.paymentMethod === 'credit') paymentLabel = 'Cartão de Crédito';
    if (orderDetails.paymentMethod === 'debit') paymentLabel = 'Cartão de Débito';
    if (orderDetails.paymentMethod === 'cash') {
      paymentLabel = `Dinheiro${orderDetails.cashChangeFor ? ` (Troco para R$ ${orderDetails.cashChangeFor})` : ' (Sem troco)'}`;
    }

    message += `💳 *Forma de Pagamento:* ${paymentLabel}\n`;

    if (orderDetails.generalNotes.trim()) {
      message += `📝 *Observações:* ${orderDetails.generalNotes.trim()}\n`;
    }

    message += `──────────────────────\n`;
    message += `_Pedido gerado via Cardápio Digital Peixaria Mancha_`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-lg bg-[#fffdec] h-full shadow-2xl flex flex-col border-l border-[#ecd596]"
      >
        {/* Drawer Header */}
        <div className="bg-[#b21818] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-bebas text-2xl tracking-wide uppercase">
              Meu Pedido ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {cart.length === 0 ? (
            <div className="text-center py-12 px-4">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="font-montserrat font-bold text-stone-700 text-sm">
                Seu carrinho está vazio
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Toque nos pratos do cardápio para adicionar ao seu pedido!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-block bg-[#b21818] text-white text-xs font-montserrat font-bold px-4 py-2 rounded-full shadow-sm"
              >
                Voltar ao Cardápio
              </button>
            </div>
          ) : (
            <>
              {/* List of Cart Items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-montserrat font-black uppercase text-stone-700">
                    Itens Selecionados
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Limpar tudo
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    className="p-3 bg-white rounded-xl border border-[#ebd8ab] shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-montserrat font-black text-xs sm:text-sm text-stone-900 uppercase">
                            {item.name}
                          </span>
                          {item.portion && (
                            <span className="bg-[#b21818] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                              {item.portion}
                            </span>
                          )}
                        </div>
                        {item.sideChoice && (
                          <p className="text-[11px] text-stone-600 italic">
                            Acompanha: {item.sideChoice}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-amber-800 italic">
                            Obs: {item.notes}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <span className="font-montserrat font-black text-sm text-[#b21818]">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white text-stone-700 font-bold flex items-center justify-center hover:bg-stone-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-montserrat font-bold text-xs px-1 text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white text-stone-700 font-bold flex items-center justify-center hover:bg-stone-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Type Toggle: Delivery vs Pickup */}
              <div className="pt-2">
                <label className="block text-xs font-montserrat font-black uppercase text-stone-700 mb-2">
                  Como deseja receber?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, orderType: 'delivery' })}
                    className={`py-2.5 px-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-montserrat font-bold transition-all ${
                      orderDetails.orderType === 'delivery'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-[#ecd596] bg-white text-stone-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Delivery (Entrega)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, orderType: 'pickup' })}
                    className={`py-2.5 px-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-montserrat font-bold transition-all ${
                      orderDetails.orderType === 'pickup'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-[#ecd596] bg-white text-stone-700'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retirada no Local</span>
                  </button>
                </div>
              </div>

              {/* Customer & Address Form */}
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#ebd8ab]">
                <span className="block text-xs font-montserrat font-black uppercase text-stone-800">
                  Dados para o Pedido
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={orderDetails.customerName}
                    onChange={(e) => setOrderDetails({ ...orderDetails, customerName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b21818]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    WhatsApp para Contato
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: (91) 98000-0000"
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b21818]"
                  />
                </div>

                {orderDetails.orderType === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Endereço de Entrega (Rua, Número, Bairro) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Tv. Barão do Triunfo, 1200 - Pedreira"
                        value={orderDetails.address}
                        onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b21818]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Ponto de Referência
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Próximo à praça / em frente à padaria"
                        value={orderDetails.referencePoint}
                        onChange={(e) => setOrderDetails({ ...orderDetails, referencePoint: e.target.value })}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b21818]"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-[#ebd8ab]">
                <span className="block text-xs font-montserrat font-black uppercase text-stone-800">
                  Forma de Pagamento
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'pix' })}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                      orderDetails.paymentMethod === 'pix'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" /> Pix
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'credit' })}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                      orderDetails.paymentMethod === 'credit'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Cartão Crédito
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'debit' })}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                      orderDetails.paymentMethod === 'debit'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Cartão Débito
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'cash' })}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                      orderDetails.paymentMethod === 'cash'
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" /> Dinheiro
                  </button>
                </div>

                {orderDetails.paymentMethod === 'cash' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Precisa de troco para quanto?
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 100,00 ou Não preciso"
                      value={orderDetails.cashChangeFor}
                      onChange={(e) => setOrderDetails({ ...orderDetails, cashChangeFor: e.target.value })}
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div>
                <label className="block text-xs font-montserrat font-black uppercase text-stone-700 mb-1">
                  Observações Gerais do Pedido:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Trazer máquina de cartão, talheres descartáveis..."
                  value={orderDetails.generalNotes}
                  onChange={(e) => setOrderDetails({ ...orderDetails, generalNotes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-[#ebd8ab] rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#b21818]"
                />
              </div>

              {validationError && (
                <div className="p-2.5 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs font-semibold">
                  {validationError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer with Totals & WhatsApp Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-[#fff9ea] border-t border-[#ebd8ab] space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-stone-900">
              <span className="font-montserrat font-bold text-sm">Subtotal:</span>
              <span className="font-montserrat font-black text-xl text-[#b21818]">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              type="button"
              id="send-order-whatsapp-btn"
              onClick={handleSendWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-4 rounded-xl font-montserrat font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-stone-500">
              O pedido será enviado diretamente para o WhatsApp da Peixaria Mancha ({RESTAURANT_INFO.phoneFormatted})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
