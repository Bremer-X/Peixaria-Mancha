import { Plus, Fish, Flame, Utensils, Users, Sparkles } from 'lucide-react';
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

  // Category Icon Resolver
  const renderCategoryIcon = () => {
    switch (category.iconName) {
      case 'Fish':
        return <Fish className="w-5 h-5 text-amber-200" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-300" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-200" />;
      default:
        return <Fish className="w-5 h-5 text-amber-200" />;
    }
  };

  return (
    <section
      id={`delivery-section-${category.id}`}
      className="scroll-mt-14 mb-5 transition-all"
    >
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-[#b21818] via-[#c42812] to-[#d97706] text-white rounded-2xl py-2.5 px-4 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-white/15 p-1.5 rounded-xl backdrop-blur-xs">
            {renderCategoryIcon()}
          </div>
          <div>
            <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase font-black leading-none drop-shadow-2xs">
              {category.title}
            </h2>
            {category.subtitle && (
              <p className="text-[10px] sm:text-xs font-montserrat font-semibold text-amber-100 uppercase tracking-wider">
                {category.subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="bg-white/20 text-white font-montserrat font-bold text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap">
          {category.items.length} {category.items.length === 1 ? 'item' : 'opções'}
        </span>
      </div>

      {/* Category Items Container */}
      <div className="mt-2.5 space-y-2.5">
        {isPortions ? (
          /* Acompanhamentos Section - Clean Modern Card Layout with Segmented Portions and Photos */
          <div className="space-y-2.5">
            {category.items.map((item) => {
              const hasImage = Boolean(item.image);

              return (
                <div
                  key={item.id}
                  id={`item-row-${item.id}`}
                  className="bg-white border border-stone-200/90 hover:border-amber-300 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Photo & Item Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasImage && (
                      <div
                        onClick={() => onSelectItem(item)}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-2xs cursor-pointer group-hover:border-amber-400 transition-colors"
                        title={`Ver detalhes de ${item.name}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => onSelectItem(item)}
                        className="font-montserrat font-black text-stone-900 text-sm uppercase tracking-tight group-hover:text-[#b21818] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-stone-500 font-medium mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Portion Selector Buttons (250g & 500g) */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    {item.price250mlFormatted && (
                      <button
                        type="button"
                        onClick={() => onSelectItem(item, '250g')}
                        className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 active:scale-95 text-stone-800 border border-amber-300/80 py-1.5 px-3 rounded-xl transition-all font-montserrat text-xs cursor-pointer group/btn"
                        title="Adicionar porção 250g"
                      >
                        <span className="font-bold text-[10px] text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                          250g
                        </span>
                        <span className="font-black text-stone-900">
                          {item.price250mlFormatted}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[#b21818] group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}

                    {item.price500mlFormatted && (
                      <button
                        type="button"
                        onClick={() => onSelectItem(item, '500g')}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100/80 active:scale-95 text-stone-800 border border-red-300/80 py-1.5 px-3 rounded-xl transition-all font-montserrat text-xs cursor-pointer group/btn"
                        title="Adicionar porção 500g"
                      >
                        <span className="font-bold text-[10px] text-red-800 bg-red-200/70 px-1.5 py-0.5 rounded">
                          500g
                        </span>
                        <span className="font-black text-[#b21818]">
                          {item.price500mlFormatted}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[#b21818] group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Peixes Fritos & Assados - Rich Dish Cards */
          <div className="space-y-2.5">
            {category.items.map((item) => {
              const hasImage = Boolean(item.image);
              const isPopular = Boolean(item.isPopular);

              return (
                <div
                  key={item.id}
                  id={`delivery-item-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className={`bg-white border rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden ${
                    isPopular
                      ? 'border-amber-300/90 ring-1 ring-amber-400/20'
                      : 'border-stone-200/90 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    {/* Optional Dish Thumbnail */}
                    {hasImage && (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-2xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                          loading="lazy"
                        />
                        {isPopular && (
                          <div className="absolute top-1 left-1 bg-[#b21818] text-white p-0.5 rounded-full shadow-xs" title="Destaque">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dish Text Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <h3 className="font-montserrat font-black text-stone-900 text-sm sm:text-base uppercase tracking-tight group-hover:text-[#b21818] transition-colors">
                          {item.name}
                        </h3>

                        {item.badge && (
                          <span
                            className={`text-[9px] sm:text-[10px] font-montserrat font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.badge === 'MAIS PEDIDO' || item.badge === 'BRASA PARAENSE'
                                ? 'bg-gradient-to-r from-[#b21818] to-[#d97706] text-white shadow-2xs'
                                : item.badge === 'PETISCO CAMPEÃO'
                                ? 'bg-amber-500 text-white'
                                : item.badge.includes('SAZONAL')
                                ? 'bg-amber-600/15 text-amber-800 border border-amber-300'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Yield indicator / Serves */}
                      {item.serves && (
                        <div className="flex items-center gap-1 text-[11px] text-[#d97706] font-semibold mt-1">
                          <Users className="w-3 h-3" />
                          <span>{item.serves}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Add Button */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0 self-center">
                      <div className="text-right">
                        <span className="font-bebas text-lg sm:text-xl font-bold text-[#b21818] leading-none block">
                          {item.priceFormatted}
                        </span>
                        {item.unitType && (
                          <span className="text-[10px] font-montserrat font-bold text-stone-400 block -mt-0.5">
                            por {item.unitType}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#b21818] hover:bg-[#8c1010] active:scale-95 text-white font-montserrat font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer min-h-[40px] min-w-[40px]"
                        title={`Adicionar ${item.name}`}
                      >
                        <Plus className="w-4 h-4 text-white" />
                        <span className="hidden xs:inline">Pedir</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

