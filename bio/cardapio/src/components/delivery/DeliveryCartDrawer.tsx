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
  Clock,
} from 'lucide-react';
import { DeliveryCartItem, DELIVERY_RESTAURANT_INFO, getDeliveryAvailability } from '../../data/deliveryMenuData';

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

    const availability = getDeliveryAvailability();
    if (!availability.isOpen) {
      msg += `⏰ *Horário:* Enviado fora do horário de delivery (07h às 14h).\n`;
    }

    msg += `─────────────────────────\n`;
    msg += `_Pedido gerado via Cardápio Digital Peixaria Mancha_`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${DELIVERY_RESTAURANT_INFO.whatsapp}?text=${encoded}`;

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-16545779111/H7mqCNjC-u4aEKeb0tE9',
        value: subtotal || 0,
        currency: 'BRL',
        transaction_id: 'PED-' + Date.now(),
      });
    }

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="delivery-cart-panel"
        className="relative w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-stone-200/80"
      >
        {/* Header */}
        <div className="bg-[#b21818] text-white p-4 flex items-center justify-between shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/15 p-1.5 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase leading-tight">
                Seu Pedido ({totalCount})
              </h2>
              <span className="text-[10px] font-montserrat font-bold text-amber-100 uppercase tracking-wider block -mt-1">
                Peixaria Mancha Delivery
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200/80 shadow-2xs">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-stone-300" />
              <p className="font-montserrat font-black text-sm text-stone-800">
                Seu pedido está vazio
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Escolha seus peixes e porções no cardápio para pedir rapidinho no WhatsApp!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="font-montserrat font-bold text-xs uppercase text-stone-600">
                  Pratos no Carrinho
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] font-montserrat font-bold text-[#b21818] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Limpar tudo
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-montserrat font-black text-xs sm:text-sm text-stone-900 uppercase leading-snug">
                          {item.name}
                        </h4>
                        {item.portion && (
                          <span className="inline-block bg-amber-50 text-[#d97706] border border-amber-200/80 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5">
                            {item.portion}
                          </span>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-stone-500 italic mt-0.5">
                            Obs: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-bebas text-base sm:text-lg font-bold text-[#b21818] whitespace-nowrap">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
                    <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-stone-200 text-stone-800 shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-montserrat font-black text-xs text-stone-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[#b21818] hover:bg-[#8c1010] text-white shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
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
            <div className="space-y-4 pt-3 border-t border-stone-200/80">
              {!getDeliveryAvailability().isOpen && (
                <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs font-montserrat shadow-2xs">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Horário Delivery: Todos os dias das 07h às 14h</span>
                    <span className="text-stone-600 font-medium leading-relaxed">
                      Você pode adiantar seu pedido agora! A equipe receberá no WhatsApp e atenderá logo no início do expediente.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <span className="bg-[#b21818] text-white font-montserrat font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bebas text-xl sm:text-2xl tracking-wide uppercase text-stone-900">
                  Dados de Entrega & Pagamento
                </h3>
              </div>

              {/* Order Type Toggle */}
              <div>
                <label className="text-xs font-montserrat font-bold uppercase text-stone-700 block mb-1.5">
                  Modalidade do Pedido:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2.5 px-3 rounded-2xl font-montserrat font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'border-[#b21818] bg-red-50/70 text-[#b21818] shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Entrega (Delivery)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2.5 px-3 rounded-2xl font-montserrat font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'border-[#d97706] bg-amber-50/70 text-[#d97706] shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
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
                  <span className="text-red-600 font-bold text-[10px] uppercase tracking-wider">* Obrigatório</span>
                </label>
                <input
                  type="text"
                  placeholder="Informe seu nome completo"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none transition-all ${
                    !customerName.trim() && validationError
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                      : 'border-stone-200 focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15'
                  }`}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                  <span>WhatsApp de Contato</span>
                  <span className="text-red-600 font-bold text-[10px] uppercase tracking-wider">* Obrigatório</span>
                </label>
                <input
                  type="tel"
                  placeholder="(91) 98888-8888"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none transition-all ${
                    (!phone.trim() || phone.replace(/\D/g, '').length < 10) && validationError
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                      : 'border-stone-200 focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15'
                  }`}
                />
              </div>

              {/* Delivery Address Fields */}
              {orderType === 'delivery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                      <span>Endereço de Entrega</span>
                      <span className="text-red-600 font-bold text-[10px] uppercase tracking-wider">* Obrigatório</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, número, bairro e complemento"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none transition-all ${
                        !address.trim() && validationError
                          ? 'border-red-500 ring-1 ring-red-500 bg-red-50/50'
                          : 'border-stone-200 focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15'
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
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15 transition-all"
                    />
                  </div>
                </>
              )}

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold text-stone-800 flex items-center justify-between">
                  <span className="uppercase">Forma de Pagamento</span>
                  <span className="text-red-600 font-bold text-[10px] uppercase tracking-wider">* Obrigatório</span>
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
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-2xs font-black'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>PIX (Instantâneo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('credit');
                      if (validationError) setValidationError('');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'credit'
                        ? 'border-[#b21818] bg-red-50/80 text-[#b21818] shadow-2xs font-black'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
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
                        ? 'border-[#b21818] bg-red-50/80 text-[#b21818] shadow-2xs font-black'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
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
                        ? 'border-[#d97706] bg-amber-50/80 text-[#d97706] shadow-2xs font-black'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
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
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15"
                    />
                  </div>
                )}
              </div>

              {/* General Notes */}
              <div className="space-y-1">
                <label className="text-xs font-montserrat font-bold text-stone-700 block">
                  Instruções para o Entregador ou Cozinha (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: interfone 204, entregar na portaria..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15 transition-all"
                />
              </div>

              {/* Error warning */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-montserrat font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & WhatsApp CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200/90 space-y-2.5 flex-shrink-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-montserrat font-bold text-[10px] uppercase text-stone-500 block">
                  Total Estimado:
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {orderType === 'delivery' ? '+ taxa a combinar' : 'Retirada no balcão'}
                </span>
              </div>
              <span className="font-bebas text-3xl font-bold text-[#b21818]">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white py-3.5 px-6 rounded-2xl font-montserrat font-black text-sm sm:text-base tracking-wide shadow-md transition-all cursor-pointer min-h-[48px] group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Enviar Pedido via WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-stone-500 font-medium">
              Ao clicar, você enviará o pedido formatado direto no WhatsApp da Peixaria!
            </p>
          </div>
        )}

        {/* Aviso exibido 3 segundos após a abertura do carrinho */}
        {showDeliveryNotice && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delivery-notice-title"
            aria-describedby="delivery-notice-description"
          >
            <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-2xl animate-in zoom-in-95">
              <AlertCircle className="mx-auto mb-2 h-10 w-10 text-[#d97706]" />
              <h3
                id="delivery-notice-title"
                className="font-bebas text-2xl tracking-wide text-[#b21818] uppercase"
              >
                Taxa de Entrega
              </h3>
              <p
                id="delivery-notice-description"
                className="mt-2 text-xs font-montserrat font-medium leading-relaxed text-stone-700"
              >
                A atendente informará a taxa de entrega exata de acordo com a sua região (bairro de Belém ou Ananindeua). Aguarde a confirmação rápida no WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setShowDeliveryNotice(false)}
                className="mt-4 w-full rounded-2xl bg-[#b21818] hover:bg-[#8c1010] active:scale-98 px-5 py-2.5 text-xs font-montserrat font-bold text-white shadow-xs transition-all cursor-pointer"
              >
                Entendi, continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

