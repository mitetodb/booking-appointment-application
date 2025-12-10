// Utility functions for date formatting and locale handling

export function getLocaleFromLanguage(langCode) {
  if (!langCode || typeof langCode !== 'string') {
    return 'en-GB'; // Default locale
  }
  
  const localeMap = {
    'bg': 'bg-BG',
    'en': 'en-GB',
    'de': 'de-DE'
  };
  return localeMap[langCode] || 'en-GB';
}

export function toLocalDateTimeString(date) {
  // Format a Date object to 'yyyy-MM-ddTHH:mm:ss' (no timezone)
  try {
    if (!date) {
      throw new Error('Date is required');
    }
    
    const pad = (n) => String(n).padStart(2, '0');
    let d;
    
    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      d = new Date(date);
    } else {
      throw new Error('Invalid date type');
    }
    
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date value');
    }
    
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
  } catch (error) {
    console.error('Error formatting date:', error, date);
    throw new Error(`Failed to format date: ${error.message}`);
  }
}

export function toDateInputValue(date) {
  // YYYY-MM-DD for input[type=date]
  try {
    if (!date) {
      throw new Error('Date is required');
    }
    
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }
    
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    return `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    console.error('Error converting date to input value:', error, date);
    throw new Error(`Failed to convert date: ${error.message}`);
  }
}
