import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { DeliveryMenuItem, DeliveryCartItem } from '../../data/deliveryMenuData';

interface DeliveryItemModalProps {
  item: DeliveryMenuItem | null;
  defaultPortion?: '250g' | '500g';
  onClose: () => void;
  onAddToCart: (cartItem: DeliveryCartItem) => void;
}

export default function DeliveryItemModal({
  item,
  defaultPortion,
  onClose,
  onAddToCart,
}: DeliveryItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<'250g' | '500g'>('250g');
  const [weightInGrams, setWeightInGrams] = useState<number>(1000);
  const [notes, setNotes] = useState('');

  const formatWeightLabel = (grams: number) => {
    if (grams >= 1000) {
      const kg = grams / 1000;
      return kg % 1 === 0 ? `${kg} KG` : `${kg.toFixed(1).replace('.', ',')} KG`;
    }
    return `${grams}g`;
  };

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setWeightInGrams(1000);
      if (defaultPortion) {
        setSelectedPortion(defaultPortion);
      } else if (item.price250ml) {
        setSelectedPortion('250g');
      } else if (item.price500ml) {
        setSelectedPortion('500g');
      }
    }
  }, [item, defaultPortion]);

  if (!item) return null;

  const hasPortions = Boolean(item?.price250ml && item?.price500ml);
  const hasWeightChoice = Boolean(item?.allowWeightChoice && item?.unitType === 'KG');

  // Calculate unit price base (preço por KG ou preço da porção)
  let unitPrice = item.price || 0;
  if (hasPortions) {
    unitPrice = selectedPortion === '250g' ? item.price250ml || 0 : item.price500ml || 0;
  } else if (!unitPrice && item.price500ml) {
    unitPrice = item.price500ml;
  }

  // Preço proporcional ao peso baseado no valor do KG
  const effectivePrice = hasWeightChoice
    ? (unitPrice * weightInGrams) / 1000
    : unitPrice;

  const totalPrice = effectivePrice * quantity;

  const handleConfirm = () => {
    let portionLabel: string | undefined = undefined;
    if (hasPortions || item.price250ml || item.price500ml) {
      portionLabel = selectedPortion;
    } else if (hasWeightChoice) {
      portionLabel = formatWeightLabel(weightInGrams);
    } else if (item.unitType === 'KG') {
      portionLabel = '1 KG';
    } else if (item.unitType === 'UNIDADE') {
      portionLabel = 'Unidade';
    } else if (item.unitType === 'BANDA') {
      portionLabel = 'Banda';
    }

    const cartItemId = `${item.id}-${portionLabel || 'default'}-${Date.now()}`;

    onAddToCart({
      id: cartItemId,
      menuItemId: item.id,
      name: item.name,
      portion: portionLabel,
      price: effectivePrice,
      quantity,
      notes: notes.trim() || undefined,
      image: item.image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-stone-200/80 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Mobile Pull Handle */}
        <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-[#b21818]">
          <div className="w-10 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="bg-[#b21818] text-white p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-montserrat font-bold text-amber-200 tracking-wider">
              {item.badge || 'DELIVERY PEIXARIA MANCHA'}
            </span>
            <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase leading-tight">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {item.image && (
            <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {item.description && (
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
              {item.description}
            </p>
          )}

          {/* Seleção de peso: 1 KG ou 500g */}
          {hasWeightChoice && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-montserrat font-bold uppercase text-stone-800 tracking-wide block">
                  Escolha o peso:
                </label>
                <span className="text-[11px] font-montserrat font-bold text-[#b21818] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60">
                  R$ {unitPrice.toFixed(2).replace('.', ',')} / KG
                </span>
              </div>

              {/* Atalhos Rápidos: 1 KG e 500g */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1 KG */}
                <button
                  type="button"
                  onClick={() => setWeightInGrams(1000)}
                  className={`p-3 rounded-2xl border-2 font-montserrat font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    weightInGrams === 1000
                      ? 'border-[#b21818] bg-red-50/60 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className={`text-2xl font-black leading-none ${weightInGrams === 1000 ? 'text-[#b21818]' : 'text-stone-900'}`}>1 KG</span>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide">Peso completo</span>
                  <span className={`font-black text-sm mt-0.5 ${weightInGrams === 1000 ? 'text-[#b21818]' : 'text-stone-800'}`}>
                    R$ {unitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </button>

                {/* 500g / Meio Quilo */}
                <button
                  type="button"
                  onClick={() => setWeightInGrams(500)}
                  className={`p-3 rounded-2xl border-2 font-montserrat font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    weightInGrams === 500
                      ? 'border-[#d97706] bg-amber-50/70 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className={`text-2xl font-black leading-none ${weightInGrams === 500 ? 'text-[#d97706]' : 'text-stone-900'}`}>500g</span>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide">Meio Quilo</span>
                  <span className={`font-black text-sm mt-0.5 ${weightInGrams === 500 ? 'text-[#d97706]' : 'text-stone-800'}`}>
                    R$ {(unitPrice * 0.5).toFixed(2).replace('.', ',')}
                  </span>
                </button>
              </div>

              {/* Seletor Stepper de Gramatura (de 100g em 100g) */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                <div className="flex items-center justify-between text-[11px] font-montserrat font-bold text-stone-600 mb-2 px-1">
                  <span>Ajuste fino do peso:</span>
                  <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/60">
                    de 100g em 100g
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white rounded-xl border border-stone-200 p-1.5 shadow-2xs">
                  <button
                    type="button"
                    disabled={weightInGrams <= 500}
                    onClick={() => setWeightInGrams(prev => Math.max(500, prev - 100))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                      weightInGrams <= 500
                        ? 'text-stone-300 bg-stone-100 cursor-not-allowed opacity-50'
                        : 'text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-95 cursor-pointer'
                    }`}
                    aria-label="Diminuir 100g"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center flex flex-col items-center">
                    <span className="font-montserrat font-black text-xl text-stone-900 leading-tight">
                      {formatWeightLabel(weightInGrams)}
                    </span>
                    <span className="text-xs font-montserrat font-black text-[#b21818]">
                      R$ {effectivePrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={weightInGrams >= 2000}
                    onClick={() => setWeightInGrams(prev => Math.min(2000, prev + 100))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                      weightInGrams >= 2000
                        ? 'text-stone-300 bg-stone-100 cursor-not-allowed opacity-50'
                        : 'text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-95 cursor-pointer'
                    }`}
                    aria-label="Aumentar 100g"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Rodapé sutil com limites */}
                <div className="flex justify-between items-center px-1 mt-2 text-[10px] font-montserrat font-semibold text-stone-400">
                  <span>Mínimo: 500g</span>
                  <span>Máximo: 2 KG</span>
                </div>
              </div>
            </div>
          )}

          {/* Portion selection — acompanhamentos 250g/500g */}
          {hasPortions && (
            <div className="space-y-2">
              <label className="text-xs font-montserrat font-bold uppercase text-stone-800 tracking-wide block">
                Escolha o tamanho da porção:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {item.price250ml && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('250g')}
                    className={`p-3 rounded-2xl border-2 font-montserrat font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedPortion === '250g'
                        ? 'border-[#d97706] bg-amber-50/70 text-stone-900 shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="uppercase text-sm font-black">Porção 250g</span>
                    <span className="font-bold text-stone-600 mt-1">
                      {item.price250mlFormatted}
                    </span>
                  </button>
                )}

                {item.price500ml && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('500g')}
                    className={`p-3 rounded-2xl border-2 font-montserrat font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedPortion === '500g'
                        ? 'border-[#b21818] bg-red-50/70 text-stone-900 shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="uppercase text-sm font-black">Porção 500g</span>
                    <span className="font-black text-[#b21818] mt-1">
                      {item.price500mlFormatted}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between py-2 border-y border-stone-200/80">
            <span className="font-montserrat font-bold text-xs uppercase tracking-wide text-stone-700">
              Quantidade de pedidos:
            </span>
            <div className="flex items-center gap-3 bg-stone-100 border border-stone-200 rounded-full p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-stone-200 text-stone-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-montserrat font-black text-base text-stone-900 w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#b21818] hover:bg-[#8c1010] text-white transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes input with Quick Suggestion Chips */}
          <div className="space-y-1.5">
            <label
              htmlFor="item-notes"
              className="font-montserrat font-bold text-xs text-stone-700 block"
            >
              Observações do pedido (opcional):
            </label>
            <div className="flex items-center gap-1.5 flex-wrap pb-1">
              {['Sem cebola', 'Bem frito / crocante', 'Limão extra', 'Molho à parte'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setNotes((prev) => prev ? `${prev}, ${chip}` : chip)}
                  className="text-[10px] font-montserrat font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200/80 cursor-pointer active:scale-95 transition-all"
                >
                  + {chip}
                </button>
              ))}
            </div>
            <textarea
              id="item-notes"
              rows={2}
              placeholder="Ex: peixe bem frito, sem cheiro-verde..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#b21818] focus:ring-2 focus:ring-[#b21818]/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-montserrat font-bold uppercase text-stone-500 block">
              Subtotal
            </span>
            <span className="font-montserrat font-black text-xl text-[#b21818]">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 bg-[#b21818] hover:bg-[#8c1010] active:scale-98 text-white font-montserrat font-bold text-xs sm:text-sm uppercase py-3.5 px-5 rounded-2xl shadow-xs transition-all cursor-pointer min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            <span>Adicionar ao Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}

