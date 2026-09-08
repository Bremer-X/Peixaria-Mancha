import { MenuCategory } from '../types';

interface MenuSectionProps {
  key?: string;
  category: MenuCategory;
}

export default function MenuSection({ category }: MenuSectionProps) {
  const isPortionColumns = category.type === 'portion-columns';
  const isGrid = category.type === 'grid';

  return (
    <section
      id={`section-${category.id}`}
      className="scroll-mt-14 mb-6 transition-all"
    >
      {/* Category Header Banner (Red curved pill) */}
      <div className="bg-[#b21818] text-white rounded-2xl py-2 px-4 shadow-sm text-center">
        <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase font-black leading-tight">
          {category.title}
        </h2>
        {category.subtitle && (
          <p className="text-[11px] sm:text-xs font-montserrat font-medium text-white/90 italic -mt-0.5">
            {category.subtitle}
          </p>
        )}
      </div>

      {/* Category Card Body */}
      <div className="bg-[#fffdec] border border-[#ecd596] rounded-2xl p-3 sm:p-5 shadow-sm mt-1">
        {/* If Portion Columns (2P / 4P) */}
        {isPortionColumns && (
          <div>
            {/* Column Header Pills (2P / 4P) */}
            <div className="flex justify-end gap-3 sm:gap-6 mb-3 pr-1 sm:pr-2">
              <span className="bg-[#b21818] text-white font-bebas tracking-wider text-sm sm:text-base px-3 sm:px-4 py-0.5 rounded-full font-bold shadow-sm">
                2P
              </span>
              <span className="bg-[#b21818] text-white font-bebas tracking-wider text-sm sm:text-base px-3 sm:px-4 py-0.5 rounded-full font-bold shadow-sm">
                4P
              </span>
            </div>

            {/* List of items */}
            <div className="divide-y divide-[#ebd8ab]/70">
              {category.items.map((item) => {
                // Special Combo Highlight: TÓ BROCADO
                if (item.isSpecialCombo) {
                  return (
                    <div
                      key={item.id}
                      id={`item-card-${item.id}`}
                      className="my-3 p-3.5 bg-gradient-to-br from-[#fff2cc] to-[#ffe599] border-2 border-[#d8a832] rounded-xl shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <span className="bg-[#b21818] text-white text-xs font-montserrat font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          {item.badge}
                        </span>
                        <span className="font-montserrat font-extrabold text-xs sm:text-sm text-stone-800 uppercase tracking-wide">
                          {item.serves}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <h3 className="font-montserrat font-black text-stone-900 text-base sm:text-lg uppercase">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-stone-700 italic font-medium mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-black text-lg sm:text-xl text-[#b21818]">
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
                    className="py-2.5 sm:py-3 flex items-center justify-between gap-2 hover:bg-[#fff7d9]/60 rounded-lg px-1 transition-colors"
                  >
                    {/* Item Name & Details */}
                    <div className="flex-1 pr-2">
                      <div className="flex items-baseline flex-wrap gap-x-1.5">
                        <span className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-tight">
                          {item.name}
                        </span>
                        {item.preparation && (
                          <span className="text-[#b21818] text-[10px] sm:text-xs font-extrabold uppercase">
                            ({item.preparation})
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] sm:text-xs text-stone-600 italic font-medium leading-tight">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* 2P and 4P Price Badges */}
                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                      {/* 2P price */}
                      {item.price2PFormatted ? (
                        <span className="min-w-[60px] sm:min-w-[70px] text-right font-montserrat font-black text-xs sm:text-sm text-[#b21818] py-1 px-1.5">
                          {item.price2PFormatted}
                        </span>
                      ) : (
                        <span className="min-w-[60px] sm:min-w-[70px] text-center text-stone-400 font-bold text-xs">
                          ---
                        </span>
                      )}

                      {/* 4P price */}
                      {item.price4PFormatted ? (
                        <span className="min-w-[60px] sm:min-w-[70px] text-right font-montserrat font-black text-xs sm:text-sm text-[#b21818] py-1 px-1.5">
                          {item.price4PFormatted}
                        </span>
                      ) : (
                        <span className="min-w-[60px] sm:min-w-[70px] text-center text-stone-400 font-bold text-xs">
                          ---
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* If Porções Extras Grid (2 columns as in the printed flyer) */}
        {isGrid && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 py-1">
            {category.items.map((item) => (
              <div
                key={item.id}
                id={`item-grid-${item.id}`}
                className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[#fff7d9]/60 transition-colors"
              >
                <span className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-wide">
                  {item.name}
                </span>

                <div className="dotted-leader opacity-70" />

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="font-montserrat font-black text-xs sm:text-sm text-[#b21818]">
                    {item.priceFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* If Single Price List (Entradas, Executivo, Açaí, Sobremesas, Bebidas) */}
        {!isPortionColumns && !isGrid && (
          <div className="divide-y divide-[#ebd8ab]/60">
            {category.items.map((item) => (
              <div
                key={item.id}
                id={`item-single-${item.id}`}
                className="py-2.5 flex items-center justify-between gap-2 hover:bg-[#fff7d9]/60 rounded-lg px-1 transition-colors"
              >
                <div className="flex-1 pr-1">
                  <div className="flex items-baseline flex-wrap gap-x-1.5">
                    <span className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-tight">
                      {item.name}
                    </span>
                    {item.preparation && (
                      <span className="text-[#b21818] text-[10px] sm:text-xs font-extrabold uppercase">
                        ({item.preparation})
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] sm:text-xs text-stone-600 italic font-medium leading-tight">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="dotted-leader hidden xs:block opacity-60" />

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="font-montserrat font-black text-xs sm:text-sm text-[#b21818]">
                    {item.priceFormatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Footer Note (e.g. Executivo side dishes notice) */}
        {category.footerNote && (
          <div className="mt-3 pt-2.5 border-t border-[#ebd8ab] text-center">
            <p className="text-[11px] sm:text-xs font-montserrat font-extrabold text-stone-800 italic uppercase tracking-wider">
              {category.footerNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
