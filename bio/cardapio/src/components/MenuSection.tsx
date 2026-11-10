import { Fish, Flame, Utensils, Users, Sparkles, Clock, Wine } from 'lucide-react';
import { MenuCategory } from '../types';

interface MenuSectionProps {
  key?: string;
  category: MenuCategory;
}

export default function MenuSection({ category }: MenuSectionProps) {
  const isPortionColumns = category.type === 'portion-columns';
  const isGrid = category.type === 'grid';

  // Category Icon Resolver
  const renderCategoryIcon = () => {
    switch (category.id) {
      case 'entradas':
        return <Sparkles className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      case 'executivo':
        return <Clock className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      case 'pratos-2-4':
        return <Fish className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      case 'caldeiradas':
      case 'grelhados':
        return <Flame className="w-5 h-5 text-[var(--color-tucuma)]" />;
      case 'porcoes-extras':
        return <Utensils className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      case 'cervejas-600':
      case 'long-neck':
      case 'refrigerantes':
      case 'sucos':
        return <Wine className="w-5 h-5 text-[var(--color-acai-gold)]" />;
      default:
        return <Fish className="w-5 h-5 text-[var(--color-acai-gold)]" />;
    }
  };

  return (
    <section
      id={`section-${category.id}`}
      className="scroll-mt-16 mb-5 transition-all"
    >
      {/* Category Header Banner */}
      <div className="bg-[var(--color-forest)] text-white rounded-2xl py-3 px-4 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs flex-shrink-0">
            {renderCategoryIcon()}
          </div>
          <div className="text-left">
            <h2 className="font-bebas text-lg sm:text-xl tracking-tight uppercase font-extrabold leading-tight">
              {category.title}
            </h2>
            {category.subtitle && (
              <p className="text-[11px] sm:text-xs font-montserrat font-medium text-[var(--color-sand)] mt-0.5">
                {category.subtitle}
              </p>
            )}
          </div>
        </div>

        <span className="bg-white/15 text-white font-montserrat font-bold text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
          {category.items.length} {category.items.length === 1 ? 'item' : 'opções'}
        </span>
      </div>

      {/* Category Card Body */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 sm:p-5 shadow-2xs mt-2">
        {/* If Portion Columns (2P / 4P) */}
        {isPortionColumns && (
          <div>
            {/* Column Header Pills (2P / 4P) */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100">
              <span className="text-[11px] font-montserrat font-bold text-stone-400 uppercase tracking-wider">
                Prato
              </span>

              <div className="flex items-center gap-3 sm:gap-6 pr-1">
                <span className="inline-flex items-center gap-1 bg-[var(--color-sand)]/40 text-[var(--color-river)] border border-[var(--color-acai-gold)]/40 font-montserrat font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg min-w-[74px] justify-center">
                  <Users className="w-3 h-3 text-[var(--color-forest)]" />
                  2 Pessoas
                </span>
                <span className="inline-flex items-center gap-1 bg-[var(--color-forest)]/10 text-[var(--color-forest)] border border-[var(--color-forest)]/25 font-montserrat font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg min-w-[74px] justify-center">
                  <Users className="w-3 h-3 text-[var(--color-forest)]" />
                  4 Pessoas
                </span>
              </div>
            </div>

            {/* List of items */}
            <div className="divide-y divide-stone-100">
              {category.items.map((item) => {
                // Special Combo Highlight: TÓ BROCADO
                if (item.isSpecialCombo) {
                  return (
                    <div
                      key={item.id}
                      id={`item-card-${item.id}`}
                      className="my-3 p-4 bg-[var(--color-sand)]/35 border-2 border-[var(--color-acai-gold)] rounded-2xl shadow-xs relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <span className="bg-[var(--color-tucuma)] text-white text-[10px] sm:text-xs font-montserrat font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white" />
                          {item.badge}
                        </span>
                        <span className="font-montserrat font-extrabold text-xs sm:text-sm text-[var(--color-forest)] uppercase tracking-wide bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                          {item.serves}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <h3 className="font-bebas font-extrabold text-[var(--color-river)] text-base sm:text-lg uppercase">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-[var(--color-river)]/80 font-medium mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="font-bebas font-extrabold text-xl sm:text-2xl text-[var(--color-forest)]">
                            {item.priceFormatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    id={`item-row-${item.id}`}
                    className="py-3 flex items-center justify-between gap-2 hover:bg-[var(--color-natural)] rounded-xl px-1.5 transition-colors"
                  >
                    {/* Item Name & Details */}
                    <div className="flex-1 pr-2">
                      <div className="flex items-baseline flex-wrap gap-x-2">
                        <span className="font-bebas font-bold text-[var(--color-river)] text-sm sm:text-base uppercase tracking-tight">
                          {item.name}
                        </span>
                        {item.preparation && (
                          <span className="bg-[var(--color-sand)]/40 text-[var(--color-forest)] border border-[var(--color-acai-gold)]/30 text-[10px] font-montserrat font-bold uppercase px-2 py-0.5 rounded-md">
                            {item.preparation}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-[var(--color-river)]/70 font-medium leading-relaxed mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* 2P and 4P Price Badges */}
                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                      {/* 2P price */}
                      {item.price2PFormatted ? (
                        <span className="min-w-[74px] text-right font-bebas font-extrabold text-sm sm:text-base text-[var(--color-forest)]">
                          {item.price2PFormatted}
                        </span>
                      ) : (
                        <span className="min-w-[74px] text-right text-stone-300 font-bold text-xs">
                          —
                        </span>
                      )}

                      {/* 4P price */}
                      {item.price4PFormatted ? (
                        <span className="min-w-[74px] text-right font-bebas font-extrabold text-sm sm:text-base text-[var(--color-tucuma)]">
                          {item.price4PFormatted}
                        </span>
                      ) : (
                        <span className="min-w-[74px] text-right text-stone-300 font-bold text-xs">
                          —
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* If Porções Extras Grid (2 columns) */}
        {isGrid && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
            {category.items.map((item) => (
              <div
                key={item.id}
                id={`item-grid-${item.id}`}
                className="flex items-center justify-between gap-2 p-3 bg-[var(--color-natural)] border border-stone-200/70 rounded-xl hover:border-[var(--color-forest)]/40 transition-colors"
              >
                <span className="font-bebas font-bold text-[var(--color-river)] text-xs sm:text-sm uppercase tracking-wide">
                  {item.name}
                </span>

                <span className="font-bebas font-extrabold text-xs sm:text-sm text-[var(--color-forest)] bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                  {item.priceFormatted}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* If Single Price List (Entradas, Executivo, Açaí, Sobremesas, Bebidas) */}
        {!isPortionColumns && !isGrid && (
          <div className="divide-y divide-stone-100">
            {category.items.map((item) => (
              <div
                key={item.id}
                id={`item-single-${item.id}`}
                className="py-3 flex items-center justify-between gap-2 hover:bg-[var(--color-natural)] rounded-xl px-1.5 transition-colors"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-baseline flex-wrap gap-x-2">
                    <span className="font-bebas font-bold text-[var(--color-river)] text-sm sm:text-base uppercase tracking-tight">
                      {item.name}
                    </span>
                    {item.preparation && (
                      <span className="bg-[var(--color-sand)]/40 text-[var(--color-forest)] border border-[var(--color-acai-gold)]/30 text-[10px] font-montserrat font-bold uppercase px-2 py-0.5 rounded-md">
                        {item.preparation}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[var(--color-river)]/70 font-medium leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="font-bebas font-extrabold text-xs sm:text-sm text-[var(--color-forest)] bg-[var(--color-sand)]/35 px-3 py-1 rounded-xl border border-[var(--color-acai-gold)]/35 shadow-2xs">
                    {item.priceFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Footer Note (e.g. Executivo side dishes notice) */}
        {category.footerNote && (
          <div className="mt-3 pt-2.5 border-t border-stone-100 text-center">
            <p className="text-[11px] sm:text-xs font-montserrat font-bold text-[var(--color-forest)] uppercase tracking-wider bg-[var(--color-natural)] p-2.5 rounded-xl border border-stone-200/70">
              {category.footerNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
