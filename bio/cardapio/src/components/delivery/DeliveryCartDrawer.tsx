import { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  ShoppingBag,
  MapPin,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import { DeliveryCartItem, DELIVERY_RESTAURANT_INFO } from '../../data/deliveryMenuData';

interface DeliveryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: DeliveryCartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function DeliveryCartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: DeliveryCartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit' | 'cash' | ''>('');
  const [cashChangeFor, setCashChangeFor] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showDeliveryNotice, setShowDeliveryNotice] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowDeliveryNotice(false);
      return;
    }

    const timer = window.setTimeout(() => setShowDeliveryNotice(true), 3000);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSendWhatsApp = () => {
    if (cart.length === 0) {
      setValidationError('Seu pedido está vazio.');
      return;
    }

    if (!customerName.trim()) {
      setValidationError('Por favor, informe seu Nome (campo obrigatório).');
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      setValidationError('Por favor, informe seu número de WhatsApp com DDD (ex: 91988888888).');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setValidationError('Por favor, informe o Endereço de entrega completo (campo obrigatório).');
      return;
    }

    if (!paymentMethod) {
      setValidationError('Por favor, selecione a Forma de Pagamento (campo obrigatório).');
      return;
    }

    if (paymentMethod === 'cash' && cashChangeFor.trim()) {
      const trocoVal = parseFloat(cashChangeFor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
      if (!isNaN(trocoVal) && trocoVal < subtotal) {
        setValidationError(`O valor para troco deve ser maior que o total do pedido (R$ ${subtotal.toFixed(2).replace('.', ',')}).`);
        return;
      }
    }

    setValidationError('');

    // Format Organized WhatsApp Message
    let msg = `🐟 *NOVO PEDIDO - PEIXARIA MANCHA (DELIVERY)*\n`;
    msg += `─────────────────────────\n`;
    msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    msg += `📱 *WhatsApp:* ${phone.trim()}\n`;
    msg += `🛵 *Modalidade:* ${orderType === 'delivery' ? 'ENTREGA (DELIVERY)' : 'RETIRADA NO BALCÃO'}\n`;

    if (orderType === 'delivery') {
      msg += `📍 *Endereço:* ${address.trim()}\n`;
      if (referencePoint.trim()) {
        msg += `🏷️ *Ponto de Ref.:* ${referencePoint.trim()}\n`;
      }
    }

    msg += `─────────────────────────\n`;
    msg += `📋 *ITENS DO PEDIDO:*\n`;

    cart.forEach((item, index) => {
      msg += `\n${index + 1}. *${item.quantity}x ${item.name}*`;
      if (item.portion) {
        msg += ` (${item.portion})`;
      }
      msg += `\n   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`;

      if (item.notes) {
        msg += `\n   Obs: ${item.notes}`;
      }
    });

    msg += `\n\n─────────────────────────\n`;
    msg += `💰 *VALOR TOTAL: R$ ${subtotal.toFixed(2).replace('.', ',')}*\n`;

    // Payment method
    let paymentText = 'PIX';
    if (paymentMethod === 'credit') paymentText = 'Cartão de Crédito';
    if (paymentMethod === 'debit') paymentText = 'Cartão de Débito';
    if (paymentMethod === 'cash') {
      paymentText = `Dinheiro${cashChangeFor.trim() ? ` (Troco para R$ ${cashChangeFor.trim()})` : ' (Não precisa de troco)'}`;
    }
    msg += `💳 *Forma de Pagamento:* ${paymentText}\n`;

    if (generalNotes.trim()) {
      msg += `📝 *Observações Gerais:* ${generalNotes.trim()}\n`;
    }

    msg += `─────────────────────────\n`;
    msg += `_Pedido gerado via Cardápio Digital Peixaria Mancha_`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="delivery-cart-panel"
        className="relative w-full max-w-lg bg-[#fffdec] h-full shadow-2xl flex flex-col border-l border-[#ecd596]"
      >
        {/* Header */}
        <div className="bg-[#b21818] text-white p-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase">
              Meu Pedido ({totalCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40 text-[#b21818]" />
              <p className="font-montserrat font-bold text-sm text-stone-700">
                Seu carrinho está vazio
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Escolha seus peixes e porções no cardápio para fazer o pedido!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebd8ab]">
                <span className="font-montserrat font-black text-xs uppercase text-stone-700">
                  Itens Selecionados
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] font-montserrat font-bold text-[#b21818] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Limpar tudo
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-[#ecd596] shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-montserrat font-black text-xs sm:text-sm text-stone-900 uppercase">
                        {item.name}
                      </h4>
                      {item.portion && (
                        <span className="inline-block bg-[#ff5e00]/10 text-[#ff5e00] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-0.5">
                          {item.portion}
                        </span>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-stone-600 italic mt-0.5">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-montserrat font-black text-xs sm:text-sm text-[#b21818] whitespace-nowrap">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-stone-200 text-stone-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-montserrat font-black text-xs text-stone-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[#ff5e00] hover:bg-[#e05200] text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customer & Checkout Form */}
          {cart.length > 0 && (
            <div className="space-y-4 pt-2 border-t-2 border-[#ebd8ab]">
              <h3 className="font-bebas text-xl sm:text-2xl tracking-wide uppercase text-stone-800">
                Informações para Entrega
              </h3>

              {/* Order Type Toggle */}
              <div>
                <label className="text-xs font-montserrat font-black uppercase text-stone-700 block mb-1.5">
                  Como deseja receber?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all ${
                      orderType === 'delivery'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/10 text-[#ff5e00] shadow-sm'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Entrega (Delivery)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2.5 px-3 rounded-xl font-montserrat font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all ${
                      orderType === 'pickup'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/10 text-[#ff5e00] shadow-sm'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retirada no Local</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                  <span>Seu Nome</span>
                  <span className="text-red-600 font-black text-[11px] uppercase tracking-wider">* Obrigatório</span>
                </label>
                <input
                  type="text"
                  placeholder="Informe seu nome completo"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    !customerName.trim() && validationError
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                      : 'border-[#d8a832] focus:ring-[#ff5e00]'
                  }`}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                  <span>WhatsApp / Telefone</span>
                  <span className="text-red-600 font-black text-[11px] uppercase tracking-wider">* Obrigatório</span>
                </label>
                <input
                  type="tel"
                  placeholder="(91) 98888-8888"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    (!phone.trim() || phone.replace(/\D/g, '').length < 10) && validationError
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                      : 'border-[#d8a832] focus:ring-[#ff5e00]'
                  }`}
                />
              </div>

              {/* Delivery Address Fields */}
              {orderType === 'delivery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                      <span>Endereço Completo de Entrega</span>
                      <span className="text-red-600 font-black text-[11px] uppercase tracking-wider">* Obrigatório</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, número, bairro e complemento"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                        !address.trim() && validationError
                          ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                          : 'border-[#d8a832] focus:ring-[#ff5e00]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-montserrat font-bold text-stone-700 block">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: próximo à praça, em frente à padaria"
                      value={referencePoint}
                      onChange={(e) => setReferencePoint(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#d8a832] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ff5e00]"
                    />
                  </div>
                </>
              )}

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                  <span className="uppercase font-black">Forma de Pagamento</span>
                  <span className="text-red-600 font-black text-[11px] uppercase tracking-wider">* Obrigatório</span>
                </label>
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl ${
                  !paymentMethod && validationError ? 'border-2 border-red-500 bg-red-50/30' : ''
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('pix');
                      if (validationError) setValidationError('');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/15 text-[#ff5e00] shadow-sm font-black'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('credit');
                      if (validationError) setValidationError('');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'credit'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/15 text-[#ff5e00] shadow-sm font-black'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('debit');
                      if (validationError) setValidationError('');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'debit'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/15 text-[#ff5e00] shadow-sm font-black'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cash');
                      if (validationError) setValidationError('');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/15 text-[#ff5e00] shadow-sm font-black'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Dinheiro</span>
                  </button>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      placeholder="Precisa de troco para quanto? (Ex: R$ 100,00)"
                      value={cashChangeFor}
                      onChange={(e) => setCashChangeFor(e.target.value)}
                      className="w-full p-2 bg-white border border-[#d8a832] rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ff5e00]"
                    />
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-stone-700 block">
                  Observações Gerais (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Alguma instrução para o entregador ou para a cozinha?"
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#d8a832] rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ff5e00]"
                />
              </div>

              {/* Error warning */}
              {validationError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-xs font-montserrat font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & WhatsApp CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t-2 border-[#ecd596] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-montserrat font-bold text-xs uppercase text-stone-600">
                Total do Pedido:
              </span>
              <span className="font-montserrat font-black text-2xl text-[#b21818]">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-6 rounded-full font-montserrat font-black text-sm sm:text-base tracking-wide shadow-md transition-all cursor-pointer group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Enviar Pedido no WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-stone-500 font-medium">
              Você será redirecionado para o WhatsApp da Peixaria com o pedido pronto!
            </p>
          </div>
        )}

        {/* Aviso exibido 3 segundos após a abertura do carrinho */}
        {showDeliveryNotice && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delivery-notice-title"
            aria-describedby="delivery-notice-description"
          >
            <div className="w-full max-w-sm rounded-3xl border-2 border-amber-300 bg-[#fffdec] p-5 text-center shadow-2xl">
              <AlertCircle className="mx-auto mb-2 h-10 w-10 text-[#ff5e00]" />
              <h3
                id="delivery-notice-title"
                className="font-bebas text-2xl tracking-wide text-[#b21818] uppercase"
              >
                Atenção sobre a entrega
              </h3>
              <p
                id="delivery-notice-description"
                className="mt-2 text-sm font-montserrat font-semibold leading-relaxed text-stone-800"
              >
                A atendente informará a taxa de entrega de acordo com a sua região
                (bairro). Aguarde a confirmação do pedido pelo WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setShowDeliveryNotice(false)}
                className="mt-5 w-full rounded-full bg-[#ff5e00] px-5 py-3 text-sm font-montserrat font-black text-white shadow-md transition-all hover:bg-[#e05200] active:scale-98"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
