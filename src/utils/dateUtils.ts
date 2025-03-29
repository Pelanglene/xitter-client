/**
 * Форматирует временную метку UNIX в читаемый формат
 * @param timestamp UNIX timestamp в секундах
 * @returns Отформатированная строка с датой и временем
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  
  // Получаем компоненты даты и времени
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Добавляем ведущие нули при необходимости
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${formattedDay}.${formattedMonth}.${year} ${formattedHours}:${formattedMinutes}`;
};

/**
 * Форматирует временную метку с учетом относительного времени
 * @param timestamp UNIX timestamp в секундах
 * @returns Относительное время (например, "5 минут назад") или дата
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) {
    return 'только что';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} ${getMinutesText(minutes)} назад`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} ${getHoursText(hours)} назад`;
  } else if (diff < 2592000) { // ~30 дней
    const days = Math.floor(diff / 86400);
    return `${days} ${getDaysText(days)} назад`;
  } else {
    return formatTimestamp(timestamp);
  }
};

// Вспомогательные функции для правильного склонения
const getMinutesText = (minutes: number): string => {
  if (minutes >= 11 && minutes <= 19) {
    return 'минут';
  }
  
  const lastDigit = minutes % 10;
  if (lastDigit === 1) {
    return 'минуту';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'минуты';
  } else {
    return 'минут';
  }
};

const getHoursText = (hours: number): string => {
  if (hours >= 11 && hours <= 19) {
    return 'часов';
  }
  
  const lastDigit = hours % 10;
  if (lastDigit === 1) {
    return 'час';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
  } else {
    return 'часов';
  }
};

const getDaysText = (days: number): string => {
  if (days >= 11 && days <= 19) {
    return 'дней';
  }
  
  const lastDigit = days % 10;
  if (lastDigit === 1) {
    return 'день';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  } else {
    return 'дней';
  }
}; 