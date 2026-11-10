/**
 * @file src/components/ProductCard.js
 * @description Componente reutilizável ProductCard para renderização consistente
 * dos pratos em destaque (com fotografia) e itens das categorias do cardápio.
 */

import { buildWhatsAppUrl } from '../services/whatsappService.js';

/**
 * Renderiza um card de produto em destaque com fotografia gastronômica.
 * @param {Object} dish - Objeto do prato de SHOWCASE_DISHES
 * @returns {string} HTML do ProductCard
 */
export function renderFeaturedProductCard(dish) {
  const whatsappUrl = buildWhatsAppUrl(dish.whatsappMessage || `Olá! Gostaria de consultar ou pedir o prato ${dish.name}.`);

  return `
    <article class="product-card group" data-category="${dish.category}">
      <div class="aspect-[16/10] relative overflow-hidden bg-[#172B35]">
        <img
          src="${dish.image}"
          alt="${dish.name} — Peixaria Mancha"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#172B35]/80 via-transparent to-transparent"></div>
        <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#173D35] text-[#F8F6F0] border border-[#D7A642]/40 shadow-sm">
            ${dish.badge}
          </span>
          <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#172B35]/85 text-[#E8D8B8] backdrop-blur-sm">
            ${dish.categoryLabel}
          </span>
        </div>
        <div class="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-[#F8F6F0]/90 font-medium">
          <span>${dish.availability}</span>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 class="font-headline font-bold text-xl text-[#172B35] group-hover:text-[#173D35] transition-colors">
            ${dish.name}
          </h3>
          <p class="text-sm text-[#415865] mt-2 leading-relaxed">
            ${dish.description}
          </p>
        </div>

        <div class="pt-4 border-t border-[#172B35]/10 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span class="text-[11px] uppercase tracking-wider font-bold text-[#415865] block">
              ${dish.priceNote || 'Valor no Salão'}
            </span>
            <span class="font-headline font-extrabold text-lg text-[#173D35]">
              ${dish.priceLabel}
            </span>
          </div>

          <a
            href="${whatsappUrl}"
            target="_blank"
            rel="noopener noreferrer"
            data-track="click_whatsapp"
            data-track-context="cardapio_destaque_${dish.id}"
            class="btn-touch px-4 py-2.5 rounded-xl bg-[#F15A24] hover:bg-[#D94B18] text-white font-bold text-xs transition-all shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Pedir pelo WhatsApp</span>
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza um item de categoria do cardápio completo.
 * @param {Object} item - Item da categoria de MENU_CATEGORIES
 * @returns {string} HTML do ProductCard compacto de categoria
 */
export function renderCategoryMenuItemCard(item) {
  const whatsappUrl = buildWhatsAppUrl(`Olá! Gostaria de consultar ou pedir: ${item.name}.`);
  const hasPortions = Boolean(item.price2p || item.price4p);

  return `
    <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#172B35]/10 hover:border-[#D7A642] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      <div class="space-y-1 flex-1">
        <div class="flex items-center flex-wrap gap-2">
          <h4 class="font-headline font-bold text-base sm:text-lg text-[#172B35]">
            ${item.name}
          </h4>
          ${item.badge ? `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D7A642]/20 text-[#173D35] border border-[#D7A642]/40">${item.badge}</span>` : ''}
          ${item.availability ? `<span class="text-[11px] font-medium text-[#415865] bg-[#F8F6F0] px-2 py-0.5 rounded-md border border-[#172B35]/10">${item.availability}</span>` : ''}
        </div>
        ${item.description ? `<p class="text-sm text-[#415865] leading-relaxed">${item.description}</p>` : ''}
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#172B35]/10 shrink-0">
        ${hasPortions ? `
          <div class="flex items-center gap-3">
            ${item.price2p ? `
              <div class="text-right">
                <span class="block text-[10px] font-bold uppercase text-[#415865]">2 Pessoas</span>
                <span class="font-headline font-extrabold text-base text-[#173D35]">${item.price2p}</span>
              </div>
            ` : ''}
            ${item.price4p ? `
              <div class="text-right pl-3 border-l border-[#172B35]/10">
                <span class="block text-[10px] font-bold uppercase text-[#415865]">4 Pessoas</span>
                <span class="font-headline font-extrabold text-base text-[#F15A24]">${item.price4p}</span>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="text-left sm:text-right">
            <span class="block text-[10px] font-bold uppercase text-[#415865]">Valor</span>
            <span class="font-headline font-extrabold text-base text-[#173D35]">${item.priceSingle || ''}</span>
          </div>
        `}

        <a
          href="${whatsappUrl}"
          target="_blank"
          rel="noopener noreferrer"
          data-track="click_whatsapp"
          data-track-context="cardapio_item_${item.name}"
          class="btn-touch px-3.5 py-2 rounded-xl bg-[#F8F6F0] hover:bg-[#F15A24] text-[#172B35] hover:text-white border border-[#172B35]/15 hover:border-[#F15A24] font-semibold text-xs transition-all inline-flex items-center gap-1.5 shrink-0"
          aria-label="Consultar ou pedir ${item.name} pelo WhatsApp"
        >
          <span>Pedir</span>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
        </a>
      </div>
    </div>
  `;
}
