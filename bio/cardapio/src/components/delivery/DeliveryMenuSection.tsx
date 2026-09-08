import { Plus } from 'lucide-react';
import { DeliveryCategory, DeliveryMenuItem } from '../../data/deliveryMenuData';

interface DeliveryMenuSectionProps {
  key?: string;
  category: DeliveryCategory;
  onSelectItem: (item: DeliveryMenuItem, defaultPortion?: '250ml' | '500ml') => void;
}

export default function DeliveryMenuSection({
  category,
  onSelectItem,
}: DeliveryMenuSectionProps) {
  const isPortions = category.type === 'portion-columns';

  return (
    <section
      id={`delivery-section-${category.id}`}
      className="scroll-mt-14 mb-6 transition-all"
    >
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-[#b21818] to-[#d63000] text-white rounded-2xl py-2 px-4 shadow-sm text-center">
        <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase font-black leading-tight">
          {category.title}
        </h2>
        {category.subtitle && (
          <p className="text-[11px] sm:text-xs font-montserrat font-semibold text-amber-200 uppercase tracking-wider -mt-0.5">
            {category.subtitle}
          </p>
        )}
      </div>

      {/* Category Card Body */}
      <div className="bg-[#fffdec] border border-[#ecd596] rounded-2xl p-3 sm:p-5 shadow-sm mt-1">
        {/* Acompanhamentos with 250ml / 500ml columns */}
        {isPortions ? (
          <div>
            {/* Column Header Pills */}
            <div className="flex justify-end gap-3 sm:gap-6 mb-3 pr-1 sm:pr-2">
              <span className="bg-[#ff5e00] text-white font-bebas tracking-wider text-xs sm:text-sm px-3 sm:px-4 py-0.5 rounded-full font-bold shadow-xs">
                250 ML
              </span>
              <span className="bg-[#b21818] text-white font-bebas tracking-wider text-xs sm:text-sm px-3 sm:px-4 py-0.5 rounded-full font-bold shadow-xs">
                500 ML
              </span>
            </div>

            <div className="divide-y divide-[#ebd8ab]/70">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  id={`item-row-${item.id}`}
                  className="py-3 flex items-center justify-between gap-2 hover:bg-[#fff7d9]/60 rounded-lg px-1 transition-colors"
                >
                  {/* Name & details */}
                  <div className="flex-1 pr-2">
                    <span className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-tight block">
                      {item.name}
                    </span>
                    {item.description && (
                      <p className="text-[11px] sm:text-xs text-stone-600 italic font-medium leading-tight mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* 250ml & 500ml buttons */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    {item.price250mlFormatted ? (
                      <button
                        type="button"
                        onClick={() => onSelectItem(item, '250ml')}
                        className="min-w-[84px] sm:min-w-[96px] text-right font-montserrat font-black text-xs sm:text-sm text-[#ff5e00] hover:bg-[#ff5e00]/10 py-1.5 px-2 rounded-lg transition-all flex items-center justify-end gap-1 group border border-[#ff5e00]/30 hover:border-[#ff5e00] cursor-pointer"
                        title="Adicionar porção 250ml"
                      >
                        <span>{item.price250mlFormatted}</span>
                        <Plus className="w-3.5 h-3.5 text-[#ff5e00] group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <span className="min-w-[84px] sm:min-w-[96px] text-center text-stone-400 font-bold text-xs">
                        ---
                      </span>
                    )}

                    {item.price500mlFormatted ? (
                      <button
                        type="button"
                        onClick={() => onSelectItem(item, '500ml')}
                        className="min-w-[84px] sm:min-w-[96px] text-right font-montserrat font-black text-xs sm:text-sm text-[#b21818] hover:bg-[#b21818]/10 py-1.5 px-2 rounded-lg transition-all flex items-center justify-end gap-1 group border border-[#b21818]/30 hover:border-[#b21818] cursor-pointer"
                        title="Adicionar porção 500ml"
                      >
                        <span>{item.price500mlFormatted}</span>
                        <Plus className="w-3.5 h-3.5 text-[#b21818] group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <span className="min-w-[84px] sm:min-w-[96px] text-center text-stone-400 font-bold text-xs">
                        ---
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Peixes Fritos & Assados List */
          <div className="divide-y divide-[#ebd8ab]/70">
            {category.items.map((item) => (
              <div
                key={item.id}
                id={`delivery-item-${item.id}`}
                onClick={() => onSelectItem(item)}
                className="py-3 flex items-center justify-between gap-2 hover:bg-[#fff7d9]/70 rounded-xl px-2 transition-all cursor-pointer group"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-montserrat font-black text-stone-900 text-xs sm:text-sm uppercase tracking-tight group-hover:text-[#b21818] transition-colors">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] sm:text-[10px] font-montserrat font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          item.badge === 'UNIDADE'
                            ? 'bg-[#ff5e00] text-white'
                            : item.badge.includes('SAZONAL')
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#b21818]/10 text-[#b21818]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] sm:text-xs text-stone-600 italic font-medium leading-tight mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="dotted-leader hidden xs:block opacity-60" />

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="font-montserrat font-black text-sm sm:text-base text-[#b21818]">
                    {item.priceFormatted}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    className="inline-flex items-center gap-1 bg-[#ff5e00] hover:bg-[#e05200] text-white p-1.5 sm:px-3 sm:py-1 rounded-full shadow-xs text-xs font-montserrat font-extrabold transition-transform active:scale-95 cursor-pointer"
                    title={`Adicionar ${item.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
