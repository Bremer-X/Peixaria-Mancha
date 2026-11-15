import { ShoppingCart, Fish, Flame, Utensils, ChevronRight, Plus } from 'lucide-react';
import { DeliveryCategory, DeliveryMenuItem } from '../../data/deliveryMenuData';

interface DeliveryMenuSectionProps {
  key?: string;
  category: DeliveryCategory;
  onSelectItem: (item: DeliveryMenuItem, defaultPortion?: '250g' | '500g') => void;
}

export default function DeliveryMenuSection({
  category,
  onSelectItem,
}: DeliveryMenuSectionProps) {
  const isPortions = category.type === 'portion-columns';

  const renderCategoryIcon = (className = 'w-4 h-4 text-[#FF5000]') => {
    switch (category.iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Utensils':
        return <Utensils className={className} />;
      case 'Fish':
      default:
        return <Fish className={className} />;
    }
  };

  return (
    <section
      id={`delivery-section-${category.id}`}
      className="scroll-mt-[335px] mb-6 transition-all"
    >
      {/* Cabeçalho limpo da seção (semelhante à imagem de referência) */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF5000]/10 flex items-center justify-center flex-shrink-0">
            {renderCategoryIcon('w-4 h-4 text-[#FF5000]')}
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-base sm:text-lg font-extrabold text-[#172B35] tracking-tight truncate">
              {category.title}
            </h2>
          </div>
        </div>

        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#FF5000] whitespace-nowrap flex-shrink-0">
          {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Lista de Cards de Produto */}
      <div className="space-y-3">
        {category.items.map((item) => {
          const hasImage = Boolean(item.image);
          const isUnavailable = item.isAvailable === false;

          return (
            <div
              key={item.id}
              id={`delivery-item-${item.id}`}
              onClick={() => !isUnavailable && onSelectItem(item)}
              className={`bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs transition-all flex items-center gap-3.5 ${
                isUnavailable
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:border-[#FF5000]/40 hover:shadow-sm cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Miniatura à esquerda */}
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden flex-shrink-0 bg-[#F8F6F0] border border-[#E8D8B8]/70 flex items-center justify-center">
                {hasImage ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-cover ${isUnavailable ? 'grayscale' : ''}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#FF5000]/70">
                    {renderCategoryIcon('w-7 h-7 text-[#FF5000]/70')}
                  </div>
                )}

                {isUnavailable && (
                  <span className="absolute inset-x-1.5 bottom-1.5 bg-[#F15A24] text-white text-[9px] font-extrabold uppercase text-center py-0.5 rounded-full shadow">
                    Esgotado
                  </span>
                )}
              </div>

              {/* Conteúdo central */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#172B35] leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FF5000]/10 text-[#FF5000]">
                      {item.badge}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                )}

                {isPortions ? (
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    {item.price250mlFormatted && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isUnavailable) onSelectItem(item, '250g');
                        }}
                        className="inline-flex items-center gap-1 bg-[#F8F6F0] hover:bg-[#E8D8B8]/50 border border-[#E8D8B8] text-[#172B35] text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        <span className="text-stone-500">250g</span>
                        <span className="text-[#FF5000] font-extrabold">{item.price250mlFormatted}</span>
                        <Plus className="w-3 h-3 text-[#FF5000]" />
                      </button>
                    )}
                    {item.price500mlFormatted && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isUnavailable) onSelectItem(item, '500g');
                        }}
                        className="inline-flex items-center gap-1 bg-[#FF5000]/10 hover:bg-[#FF5000]/15 border border-[#FF5000]/25 text-[#FF5000] text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        <span>500g</span>
                        <span className="font-extrabold">{item.price500mlFormatted}</span>
                        <Plus className="w-3 h-3 text-[#FF5000]" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="font-heading text-base sm:text-lg font-extrabold text-[#FF5000]">
                      {item.priceFormatted || `R$ ${Number(item.price || 0).toFixed(2).replace('.', ',')}`}
                    </span>
                    {item.unitType && (
                      <span className="text-[11px] font-semibold text-stone-400">
                        / {item.unitType.toLowerCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Botão circular à direita */}
              {!isUnavailable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="w-10 h-10 rounded-full bg-[#FF5000] hover:bg-[#E04600] active:scale-90 text-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all cursor-pointer"
                  title={`Adicionar ${item.name}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
