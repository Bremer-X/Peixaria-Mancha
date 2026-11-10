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
        return <Fish className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[var(--color-tucuma)]" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      default:
        return <Fish className="w-5 h-5 text-[var(--color-acai-gold)]" />;
    }
  };

  return (
    <section
      id={`delivery-section-${category.id}`}
      className="scroll-mt-14 mb-5 transition-all"
    >
      {/* Category Header Banner */}
      <div className="bg-[var(--color-forest)] text-white rounded-2xl py-3 px-4 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
            {renderCategoryIcon()}
          </div>
          <div>
            <h2 className="font-bebas text-lg sm:text-xl tracking-tight uppercase font-extrabold leading-tight">
              {category.title}
            </h2>
            {category.subtitle && (
              <p className="text-[11px] sm:text-xs font-montserrat font-medium text-[var(--color-sand)]">
                {category.subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="bg-white/15 text-white font-montserrat font-bold text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
          {category.items.length} {category.items.length === 1 ? 'item' : 'opções'}
        </span>
      </div>

      {/* Category Items Container */}
      <div className="mt-2.5 space-y-2.5">
        {isPortions ? (
          /* Acompanhamentos Section */
          <div className="space-y-2.5">
            {category.items.map((item) => {
              const hasImage = Boolean(item.image);

              return (
                <div
                  key={item.id}
                  id={`item-row-${item.id}`}
                  className="bg-white border border-stone-200/90 hover:border-[var(--color-forest)]/40 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Photo & Item Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasImage && (
                      <div
                        onClick={() => onSelectItem(item)}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-2xs cursor-pointer group-hover:border-[var(--color-forest)] transition-colors"
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
                        className="font-bebas font-bold text-[var(--color-river)] text-sm sm:text-base uppercase tracking-tight group-hover:text-[var(--color-forest)] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[var(--color-river)]/70 font-medium mt-0.5 leading-snug">
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
                        className="inline-flex items-center gap-1.5 bg-[var(--color-sand)]/35 hover:bg-[var(--color-sand)]/60 active:scale-95 text-[var(--color-river)] border border-[var(--color-acai-gold)]/40 py-2 px-3 min-h-[42px] rounded-xl transition-all font-montserrat text-xs cursor-pointer group/btn"
                        title="Adicionar porção 250g"
                      >
                        <span className="font-bold text-[10px] text-[var(--color-forest)] bg-white px-1.5 py-0.5 rounded">
                          250g
                        </span>
                        <span className="font-extrabold text-[var(--color-river)]">
                          {item.price250mlFormatted}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[var(--color-tucuma)] group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}

                    {item.price500mlFormatted && (
                      <button
                        type="button"
                        onClick={() => onSelectItem(item, '500g')}
                        className="inline-flex items-center gap-1.5 bg-[var(--color-forest)]/10 hover:bg-[var(--color-forest)]/15 active:scale-95 text-[var(--color-river)] border border-[var(--color-forest)]/25 py-2 px-3 min-h-[42px] rounded-xl transition-all font-montserrat text-xs cursor-pointer group/btn"
                        title="Adicionar porção 500g"
                      >
                        <span className="font-bold text-[10px] text-white bg-[var(--color-forest)] px-1.5 py-0.5 rounded">
                          500g
                        </span>
                        <span className="font-extrabold text-[var(--color-forest)]">
                          {item.price500mlFormatted}
                        </span>
                        <Plus className="w-3.5 h-3.5 text-[var(--color-tucuma)] group-hover/btn:scale-110 transition-transform" />
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
                      ? 'border-[var(--color-acai-gold)] ring-1 ring-[var(--color-acai-gold)]/20'
                      : 'border-stone-200/90 hover:border-[var(--color-forest)]/40'
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
                          <div className="absolute top-1 left-1 bg-[var(--color-forest)] text-white p-1 rounded-full shadow-xs" title="Destaque">
                            <Sparkles className="w-3 h-3 text-[var(--color-acai-gold)]" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dish Text Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <h3 className="font-bebas font-bold text-[var(--color-river)] text-sm sm:text-base uppercase tracking-tight group-hover:text-[var(--color-forest)] transition-colors">
                          {item.name}
                        </h3>

                        {item.badge && (
                          <span
                            className={`text-[9px] sm:text-[10px] font-montserrat font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              item.badge === 'MAIS PEDIDO' || item.badge === 'BRASA PARAENSE'
                                ? 'bg-[var(--color-tucuma)] text-white shadow-2xs'
                                : item.badge === 'PETISCO CAMPEÃO'
                                ? 'bg-[var(--color-forest)] text-white'
                                : item.badge.includes('SAZONAL')
                                ? 'bg-[var(--color-sand)]/50 text-[var(--color-forest)] border border-[var(--color-acai-gold)]/50'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-[var(--color-river)]/70 font-medium leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Yield indicator / Serves */}
                      {item.serves && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--color-forest)] font-semibold mt-1">
                          <Users className="w-3 h-3 text-[var(--color-acai-gold)]" />
                          <span>{item.serves}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Add Button */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0 self-center">
                      <div className="text-right">
                        <span className="font-bebas text-lg sm:text-xl font-extrabold text-[var(--color-forest)] leading-none block">
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
                        className="inline-flex items-center justify-center gap-1.5 bg-[var(--color-tucuma)] hover:opacity-95 active:scale-95 text-white font-montserrat font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer min-h-[44px] min-w-[44px]"
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
