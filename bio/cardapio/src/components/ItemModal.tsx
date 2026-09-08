import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface ItemModalProps {
  item: MenuItem | null;
  defaultPortion?: '2P' | '4P';
  isExecutivo?: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function ItemModal({
  item,
  defaultPortion,
  isExecutivo = false,
  onClose,
  onAddToCart,
}: ItemModalProps) {
  if (!item) return null;

  const hasPortions = Boolean(item.price2P && item.price4P);
  const [selectedPortion, setSelectedPortion] = useState<'2P' | '4P' | 'Individual'>(
    defaultPortion || (item.price2P ? '2P' : 'Individual')
  );
  const [sideChoice, setSideChoice] = useState<'Baião de Dois' | 'Feijão'>('Baião de Dois');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset state whenever item or defaultPortion changes
  useEffect(() => {
    if (defaultPortion) {
      setSelectedPortion(defaultPortion);
    } else if (item.price2P) {
      setSelectedPortion('2P');
    } else {
      setSelectedPortion('Individual');
    }
    setQuantity(1);
    setNotes('');
  }, [item, defaultPortion]);

  // Determine unit price
  let unitPrice = item.price || 0;
  if (selectedPortion === '2P' && item.price2P) {
    unitPrice = item.price2P;
  } else if (selectedPortion === '4P' && item.price4P) {
    unitPrice = item.price4P;
  }

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const cartItemId = `${item.id}-${selectedPortion}-${sideChoice}-${notes ? 'noted' : 'plain'}`;
    onAddToCart({
      id: cartItemId,
      menuItemId: item.id,
      name: item.name,
      portion: hasPortions ? selectedPortion : undefined,
      price: unitPrice,
      quantity,
      notes: notes.trim() || undefined,
      sideChoice: isExecutivo ? sideChoice : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="item-modal-container"
        className="w-full max-w-md bg-[#fffdec] rounded-t-3xl sm:rounded-3xl border-2 border-[#ecd596] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#b21818] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="pr-4">
            <h3 className="font-bebas text-2xl tracking-wide uppercase leading-tight">
              {item.name}
            </h3>
            {item.preparation && (
              <span className="text-xs font-montserrat font-bold text-amber-200 uppercase">
                ({item.preparation})
              </span>
            )}
          </div>
          <button
            id="close-item-modal-btn"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {item.description && (
            <div className="bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl">
              <p className="text-xs sm:text-sm text-stone-700 italic font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Portion Selection (2P vs 4P) if applicable */}
          {hasPortions && (
            <div>
              <label className="block text-xs font-montserrat font-black uppercase text-stone-800 mb-2">
                Escolha o tamanho da porção:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {item.price2PFormatted && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('2P')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      selectedPortion === '2P'
                        ? 'border-[#b21818] bg-[#ffebeb] shadow-sm'
                        : 'border-[#ecd596] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-montserrat font-bold text-sm text-stone-900">
                        2 Pessoas
                      </span>
                      {selectedPortion === '2P' && (
                        <Check className="w-4 h-4 text-[#b21818]" />
                      )}
                    </div>
                    <span className="font-montserrat font-black text-sm text-[#b21818]">
                      {item.price2PFormatted}
                    </span>
                  </button>
                )}

                {item.price4PFormatted && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('4P')}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      selectedPortion === '4P'
                        ? 'border-[#b21818] bg-[#ffebeb] shadow-sm'
                        : 'border-[#ecd596] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-montserrat font-bold text-sm text-stone-900">
                        4 Pessoas
                      </span>
                      {selectedPortion === '4P' && (
                        <Check className="w-4 h-4 text-[#b21818]" />
                      )}
                    </div>
                    <span className="font-montserrat font-black text-sm text-[#b21818]">
                      {item.price4PFormatted}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Executivo Side Choice */}
          {isExecutivo && (
            <div>
              <label className="block text-xs font-montserrat font-black uppercase text-stone-800 mb-1.5">
                Acompanhamento principal (com farofa e vinagrete inclusos):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['Baião de Dois', 'Feijão'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSideChoice(side)}
                    className={`p-2.5 rounded-xl border-2 text-center text-xs font-montserrat font-bold transition-all ${
                      sideChoice === side
                        ? 'border-[#b21818] bg-[#ffebeb] text-[#b21818]'
                        : 'border-[#ecd596] bg-white text-stone-800'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div>
            <label className="block text-xs font-montserrat font-black uppercase text-stone-800 mb-2">
              Quantidade:
            </label>
            <div className="flex items-center justify-between bg-white border border-[#ecd596] rounded-xl p-2 max-w-[180px]">
              <button
                type="button"
                id="modal-decrease-qty"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-montserrat font-black text-lg text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                id="modal-increase-qty"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-montserrat font-black uppercase text-stone-800 mb-1.5">
              Observações (opcional):
            </label>
            <textarea
              id="item-modal-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, ponto da carne, caprichar no molho..."
              className="w-full p-2.5 text-xs bg-white border border-[#ecd596] rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b21818]"
            />
          </div>
        </div>

        {/* Modal Footer with Add Button */}
        <div className="p-4 bg-stone-50 border-t border-[#ebd8ab] flex items-center gap-3">
          <button
            type="button"
            id="add-to-cart-confirm-btn"
            onClick={handleAdd}
            className="flex-1 bg-[#b21818] hover:bg-[#8f1212] active:scale-98 text-white py-3 px-4 rounded-xl font-montserrat font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-md transition-all"
          >
            <span>Adicionar ao Pedido</span>
            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
