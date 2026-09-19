import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { DeliveryMenuItem, DeliveryCartItem } from '../../data/deliveryMenuData';

interface DeliveryItemModalProps {
  item: DeliveryMenuItem | null;
  defaultPortion?: '250ml' | '500ml';
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
  const [selectedPortion, setSelectedPortion] = useState<'250ml' | '500ml'>('250ml');
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
        setSelectedPortion('250ml');
      } else if (item.price500ml) {
        setSelectedPortion('500ml');
      }
    }
  }, [item, defaultPortion]);

  if (!item) return null;

  const hasPortions = Boolean(item?.price250ml && item?.price500ml);
  const hasWeightChoice = Boolean(item?.allowWeightChoice && item?.unitType === 'KG');

  // Calculate unit price base (preço por KG ou preço da porção)
  let unitPrice = item.price || 0;
  if (hasPortions) {
    unitPrice = selectedPortion === '250ml' ? item.price250ml || 0 : item.price500ml || 0;
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
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#fffdec] w-full max-w-md rounded-3xl shadow-2xl border-2 border-[#ecd596] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#b21818] text-white p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase font-montserrat font-extrabold text-amber-200 tracking-wider">
              {item.badge || 'DELIVERY PEIXARIA MANCHA'}
            </span>
            <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase leading-tight">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {item.description && (
            <p className="text-xs sm:text-sm text-stone-700 italic font-medium leading-relaxed bg-[#fff7d9] p-3 rounded-xl border border-[#ecd596]">
              {item.description}
            </p>
          )}

          {/* Seleção de peso: 1 KG ou 500g + Ajuste fino de 100g em 100g */}
          {hasWeightChoice && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-montserrat font-black uppercase text-stone-800 tracking-wide block">
                  Escolha a quantidade:
                </label>
                <span className="text-[11px] font-montserrat font-bold text-amber-900 bg-[#fff5d6] px-2.5 py-0.5 rounded-full border border-[#ecd596]">
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
                      ? 'border-[#b21818] bg-[#b21818]/10 shadow-sm scale-102'
                      : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6] hover:border-[#d8a832]'
                  }`}
                >
                  <span className={`text-2xl font-black leading-none ${weightInGrams === 1000 ? 'text-[#b21818]' : 'text-stone-900'}`}>1 KG</span>
                  <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wide">Peso completo</span>
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
                      ? 'border-[#ff5e00] bg-[#ff5e00]/10 shadow-sm scale-102'
                      : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6] hover:border-[#d8a832]'
                  }`}
                >
                  <span className={`text-2xl font-black leading-none ${weightInGrams === 500 ? 'text-[#ff5e00]' : 'text-stone-900'}`}>500g</span>
                  <span className="text-[10px] uppercase font-extrabold text-stone-400 tracking-wide">Meio Quilo</span>
                  <span className={`font-black text-sm mt-0.5 ${weightInGrams === 500 ? 'text-[#ff5e00]' : 'text-stone-800'}`}>
                    R$ {(unitPrice * 0.5).toFixed(2).replace('.', ',')}
                  </span>
                </button>
              </div>

              {/* Seletor Stepper de Gramatura (de 100g em 100g) */}
              <div className="bg-[#fff9e6] p-3 rounded-2xl border border-[#ecd596] shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-montserrat font-bold text-stone-600 mb-2 px-1">
                  <span>Ajuste personalizado:</span>
                  <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/60">
                    de 100g em 100g
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white rounded-xl border border-[#e5cf94] p-1.5 shadow-inner">
                  <button
                    type="button"
                    disabled={weightInGrams <= 500}
                    onClick={() => setWeightInGrams(prev => Math.max(500, prev - 100))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                      weightInGrams <= 500
                        ? 'text-stone-300 bg-stone-100 cursor-not-allowed opacity-50'
                        : 'text-stone-800 bg-[#fff5d6] hover:bg-[#ffebad] active:scale-95 cursor-pointer shadow-xs'
                    }`}
                    aria-label="Diminuir 100g"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center flex flex-col items-center">
                    <span className="font-montserrat font-black text-2xl text-stone-900 leading-tight">
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
                        : 'text-stone-800 bg-[#fff5d6] hover:bg-[#ffebad] active:scale-95 cursor-pointer shadow-xs'
                    }`}
                    aria-label="Aumentar 100g"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Rodapé sutil com limites */}
                <div className="flex justify-between items-center px-1 mt-2 text-[10px] font-montserrat font-semibold text-stone-500">
                  <span>Mínimo: 500g</span>
                  {weightInGrams > 500 && weightInGrams < 1000 && (
                    <span className="text-amber-800 font-extrabold">
                      (Opção fracionada)
                    </span>
                  )}
                  <span>Máximo: 2 KG</span>
                </div>
              </div>
            </div>
          )}

          {/* Portion selection — apenas para acompanhamentos 250ml/500ml */}
          {hasPortions && (
            <div className="space-y-2">
              <label className="text-xs font-montserrat font-black uppercase text-stone-800 tracking-wide block">
                Escolha o tamanho da porção:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {item.price250ml && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('250ml')}
                    className={`p-3 rounded-xl border-2 font-montserrat font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      selectedPortion === '250ml'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/10 text-[#ff5e00] shadow-sm'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <span className="uppercase text-sm">Porção 250ml</span>
                    <span className="font-black text-stone-900 mt-1">
                      {item.price250mlFormatted}
                    </span>
                  </button>
                )}

                {item.price500ml && (
                  <button
                    type="button"
                    onClick={() => setSelectedPortion('500ml')}
                    className={`p-3 rounded-xl border-2 font-montserrat font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      selectedPortion === '500ml'
                        ? 'border-[#ff5e00] bg-[#ff5e00]/10 text-[#ff5e00] shadow-sm'
                        : 'border-[#ecd596] bg-white text-stone-700 hover:bg-[#fff9e6]'
                    }`}
                  >
                    <span className="uppercase text-sm">Porção 500ml</span>
                    <span className="font-black text-stone-900 mt-1">
                      {item.price500mlFormatted}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-[#ebd8ab]">
            <span className="font-montserrat font-black text-xs uppercase tracking-wide text-stone-800">
              Quantidade:
            </span>
            <div className="flex items-center gap-3 bg-white border border-[#ecd596] rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-montserrat font-black text-base text-stone-900 w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5e00] hover:bg-[#e05200] text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes input */}
          <div className="space-y-1">
            <label
              htmlFor="item-notes"
              className="font-montserrat font-bold text-xs text-stone-700 block"
            >
              Observações (opcional):
            </label>
            <textarea
              id="item-notes"
              rows={2}
              placeholder="Ex: peixe bem frito, sem cebola, talher descartável..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-[#d8a832] rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ff5e00]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-[#ecd596] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-montserrat font-extrabold uppercase text-stone-500 block">
              Subtotal
            </span>
            <span className="font-montserrat font-black text-xl text-[#b21818]">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 max-w-xs inline-flex items-center justify-center gap-2 bg-[#ff5e00] hover:bg-[#e05200] active:scale-98 text-white font-montserrat font-black text-xs sm:text-sm uppercase py-3 px-5 rounded-full shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Adicionar ao Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
