// Utility functions for date formatting and locale handling

export function getLocaleFromLanguage(langCode) {
  const localeMap = {
    'bg': 'bg-BG',
    'en': 'en-GB',
    'de': 'de-DE'
  };
  return localeMap[langCode] || 'en-GB';
}

export function toLocalDateTimeString(date) {
  // Format a Date object to 'yyyy-MM-ddTHH:mm:ss' (no timezone)
  const pad = (n) => String(n).padStart(2, '0');
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

export function toDateInputValue(date) {
  // YYYY-MM-DD for input[type=date]
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}
