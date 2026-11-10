/**
 * @file src/services/analyticsService.js
 * @description Serviço padronizado de Analytics (Google Tag Manager / GA4 / Google Ads / Meta Pixel).
 * Evita disparos duplicados e nunca contabiliza clique como pedido concluído.
 */

const lastFiredTimestamps = new Map();
const DEDUPE_INTERVAL_MS = 1200;

/**
 * Eventos padronizados:
 * - view_menu
 * - click_whatsapp
 * - click_directions
 * - view_event
 * - click_social
 *
 * @param {'view_menu'|'click_whatsapp'|'click_directions'|'view_event'|'click_social'} eventName
 * @param {Record<string, any>} [params]
 */
export function trackEvent(eventName, params = {}) {
  const dedupeKey = `${eventName}:${params.cta_location || params.item_name || params.platform || 'default'}`;
  const now = Date.now();
  const lastFired = lastFiredTimestamps.get(dedupeKey) || 0;

  if (now - lastFired < DEDUPE_INTERVAL_MS) {
    return; // Previne disparo duplicado
  }
  lastFiredTimestamps.set(dedupeKey, now);

  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        send_to: 'G-7WDDRBG9TC'
      });
    }

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      // Usa trackCustom para não contaminar eventos de compra concluída (Purchase)
      window.fbq('trackCustom', eventName, params);
    }
  } catch (err) {
    // Falha silenciosa caso bloqueadores de anúncio estejam ativos
  }
}
