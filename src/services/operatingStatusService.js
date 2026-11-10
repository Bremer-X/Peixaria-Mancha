/**
 * @file src/services/operatingStatusService.js
 * @description Cálculo do status de funcionamento considerando o fuso horário America/Belem,
 * dias de funcionamento (Terça a Domingo, 11h às 20h; Segunda fechado) e estados claros.
 */

export const OPERATING_SCHEDULE = {
  0: { open: 11, close: 20, name: 'Domingo' },
  1: null, // Segunda-feira fechado no salão
  2: { open: 11, close: 20, name: 'Terça-feira' },
  3: { open: 11, close: 20, name: 'Quarta-feira' },
  4: { open: 11, close: 20, name: 'Quinta-feira' },
  5: { open: 11, close: 20, name: 'Sexta-feira' },
  6: { open: 11, close: 20, name: 'Sábado' }
};

/**
 * Obtém data/hora no fuso America/Belem.
 * @param {Date} [referenceDate]
 */
export function getBelemTimeParts(referenceDate = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Belem',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(referenceDate);
    const weekdayStr = parts.find((p) => p.type === 'weekday')?.value || 'Sun';
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10) % 24;
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);

    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dayOfWeek = dayMap[weekdayStr] ?? referenceDate.getDay();

    return { dayOfWeek, hour, minute };
  } catch {
    return {
      dayOfWeek: referenceDate.getDay(),
      hour: referenceDate.getHours(),
      minute: referenceDate.getMinutes()
    };
  }
}

/**
 * Retorna o estado atual de funcionamento do restaurante.
 * Estados possíveis:
 * - "Aberto agora"
 * - "Fechado agora"
 * - "Abre às [horário]"
 * - "Horário especial"
 */
export function getOperatingStatus(referenceDate = new Date(), specialScheduleNote = null) {
  if (specialScheduleNote) {
    return {
      isOpen: true,
      stateClass: 'especial',
      shortText: 'Horário especial',
      fullText: `Horário especial • ${specialScheduleNote}`
    };
  }

  const { dayOfWeek, hour, minute } = getBelemTimeParts(referenceDate);
  const schedule = OPERATING_SCHEDULE[dayOfWeek];
  const currentMinutes = hour * 60 + minute;

  if (!schedule) {
    // Segunda-feira (salão fechado, abre terça às 11h)
    return {
      isOpen: false,
      stateClass: 'fechado',
      shortText: 'Fechado agora',
      fullText: 'Fechado agora • Abre Terça às 11h'
    };
  }

  const openMinutes = schedule.open * 60;
  const closeMinutes = schedule.close * 60;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      stateClass: 'aberto',
      shortText: 'Aberto agora',
      fullText: `Aberto agora • Até ${schedule.close}h`
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      stateClass: 'fechado',
      shortText: `Abre às ${schedule.open}h`,
      fullText: `Fechado agora • Abre às ${schedule.open}h`
    };
  }

  // Após as 20h: verificar se amanhã é segunda-feira (dia 0 -> domingo à noite abre terça)
  const opensTomorrow = dayOfWeek !== 0;
  return {
    isOpen: false,
    stateClass: 'fechado',
    shortText: 'Fechado agora',
    fullText: opensTomorrow ? 'Fechado agora • Abre às 11h' : 'Fechado agora • Abre Terça às 11h'
  };
}
