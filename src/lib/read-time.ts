export function parseReadTimeToMinutes(readTime: unknown): number {
  if (typeof readTime === 'number' && Number.isFinite(readTime)) {
    return Math.max(0, Math.round(readTime));
  }

  if (typeof readTime !== 'string') {
    return 0;
  }

  const normalized = readTime.toLowerCase().trim();
  if (!normalized) {
    return 0;
  }

  const parseNumber = (value: string): number => {
    const parsed = Number.parseFloat(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  let totalMinutes = 0;
  const hours = normalized.match(/(\d+(?:[.,]\d+)?)\s*(h|std|stunde|stunden|hour|hours)\b/);
  const minutes = normalized.match(/(\d+(?:[.,]\d+)?)\s*(m|min|minute|minuten)\b/);

  if (hours) {
    totalMinutes += parseNumber(hours[1]) * 60;
  }
  if (minutes) {
    totalMinutes += parseNumber(minutes[1]);
  }

  if (totalMinutes > 0) {
    return Math.max(0, Math.round(totalMinutes));
  }

  const firstNumber = normalized.match(/(\d+(?:[.,]\d+)?)/);
  if (!firstNumber) {
    return 0;
  }

  return Math.max(0, Math.round(parseNumber(firstNumber[1])));
}

export function sumReadTimes(readTimes: unknown[]): number {
  let total = 0;

  for (const readTime of readTimes) {
    total += parseReadTimeToMinutes(readTime);
  }

  return total;
}

export function formatDurationMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const days = Math.floor(safeMinutes / (60 * 24));
  const hours = Math.floor((safeMinutes % (60 * 24)) / 60);
  const minutes = safeMinutes % 60;

  if (days > 0) {
    if (hours > 0) {
      return `${days} ${days === 1 ? 'Tag' : 'Tage'} ${hours} Std`;
    }
    return `${days} ${days === 1 ? 'Tag' : 'Tage'}`;
  }

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} Std ${minutes} Min`;
    }
    return `${hours} Std`;
  }

  return `${minutes} Min`;
}
