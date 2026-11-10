/**
 * @file src/services/whatsappService.js
 * @description Serviço centralizado para abertura de conversas no WhatsApp
 * com mensagens contextuais e preservação dos números oficiais.
 */

import { RESTAURANT_META } from '../data/siteData.js';
import { trackEvent } from './analyticsService.js';

export const WHATSAPP_MESSAGES = {
  cardapio: 'Olá! Gostaria de conhecer o cardápio.',
  pedido: 'Olá! Gostaria de fazer um pedido.',
  eventos: 'Olá! Gostaria de informações sobre os eventos.',
  reserva: 'Olá! Gostaria de reservar uma mesa para minha família.',
  box: 'Olá! Gostaria de saber mais sobre os peixes frescos do Box da Peixaria Mancha.'
};

/**
 * Constrói a URL oficial do WhatsApp com mensagem contextual codificada.
 * @param {string} contextOrCustomMessage - Chave do contexto ('cardapio', 'pedido', 'eventos', 'reserva') ou mensagem customizada
 * @param {string} [phone] - Número do WhatsApp (padrão: 5591989379978)
 * @returns {string} URL formatada para wa.me
 */
export function buildWhatsAppUrl(contextOrCustomMessage = 'pedido', phone = RESTAURANT_META.whatsappNumber) {
  const message = WHATSAPP_MESSAGES[contextOrCustomMessage] || contextOrCustomMessage || WHATSAPP_MESSAGES.pedido;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Abre o WhatsApp em nova aba e registra o evento analítico padronizado `click_whatsapp`.
 * @param {string} context - Contexto do clique (ex: 'hero', 'header', 'cardapio', 'eventos', 'mobile_bar')
 * @param {string} [customMessage] - Mensagem contextual opcional
 */
export function openWhatsApp(context = 'geral', customMessage) {
  const message = customMessage || WHATSAPP_MESSAGES[context] || WHATSAPP_MESSAGES.pedido;
  const url = buildWhatsAppUrl(message);
  trackEvent('click_whatsapp', {
    cta_location: context,
    message_intent: message.slice(0, 60)
  });
  window.open(url, '_blank', 'noopener,noreferrer');
}
