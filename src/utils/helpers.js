// src/utils/helpers.js

/**
 * 格式化日期顯示
 * @param {string|Date} date - 日期
 * @param {string} locale - 地區設定，預設為 'zh-TW'
 * @returns {string} 格式化後的日期字串
 */
export const formatDate = (date, locale = 'zh-TW') => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString(locale);
  } catch (error) {
    console.error('日期格式化錯誤:', error);
    return '';
  }
};

/**
 * 格式化日期時間顯示
 * @param {string|Date} date - 日期時間
 * @param {string} locale - 地區設定，預設為 'zh-TW'
 * @returns {string} 格式化後的日期時間字串
 */
export const formatDateTime = (date, locale = 'zh-TW') => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleString(locale);
  } catch (error) {
    console.error('日期時間格式化錯誤:', error);
    return '';
  }
};

/**
 * 格式化金額顯示
 * @param {number} amount - 金額
 * @param {string} currency - 貨幣符號，預設為 'NT$'
 * @returns {string} 格式化後的金額字串
 */
export const formatCurrency = (amount, currency = 'NT$') => {
  if (!amount || amount === 0) return '';
  
  try {
    return `${currency} ${amount.toLocaleString('zh-TW')}`;
  } catch (error) {
    console.error('金額格式化錯誤:', error);
    return `${currency} ${amount}`;
  }
};

/**
 * 深度複製物件
 * @param {any} obj - 要複製的物件
 * @returns {any} 複製後的物件
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * 防抖函數
 * @param {Function} func - 要防抖的函數
 * @param {number} wait - 等待時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 節流函數
 * @param {Function} func - 要節流的函數
 * @param {number} limit - 限制時間（毫秒）
 * @returns {Function} 節流後的函數
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 生成唯一 ID
 * @returns {string} 唯一 ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 檢查是否為空值
 * @param {any} value - 要檢查的值
 * @returns {boolean} 是否為空
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 安全的 JSON 解析
 * @param {string} jsonString - JSON 字串
 * @param {any} defaultValue - 預設值
 * @returns {any} 解析結果或預設值
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON 解析錯誤:', error);
    return defaultValue;
  }
};

/**
 * 安全的 JSON 字串化
 * @param {any} obj - 要字串化的物件
 * @param {string} defaultValue - 預設值
 * @returns {string} JSON 字串或預設值
 */
export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('JSON 字串化錯誤:', error);
    return defaultValue;
  }
};

/**
 * 計算兩個日期之間的天數差
 * @param {string|Date} date1 - 第一個日期
 * @param {string|Date} date2 - 第二個日期
 * @returns {number} 天數差
 */
export const daysBetween = (date1, date2) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  } catch (error) {
    console.error('日期計算錯誤:', error);
    return 0;
  }
};

/**
 * 獲取相對時間顯示（如：2小時前、3天前）
 * @param {string|Date} date - 日期
 * @returns {string} 相對時間字串
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) {
      return '剛剛';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分鐘前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小時前`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}天前`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error('相對時間計算錯誤:', error);
    return formatDate(date);
  }
};

/**
 * 高亮搜尋關鍵字
 * @param {string} text - 原始文字
 * @param {string} searchTerm - 搜尋關鍵字
 * @returns {string} 高亮後的 HTML 字串
 */
export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark style="background-color: #fef08a; padding: 1px 2px; border-radius: 2px;">$1</mark>');
};

/**
 * 截斷文字並添加省略號
 * @param {string} text - 原始文字
 * @param {number} maxLength - 最大長度
 * @returns {string} 截斷後的文字
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 驗證 email 格式
 * @param {string} email - email 地址
 * @returns {boolean} 是否為有效 email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 驗證手機號碼格式（台灣）
 * @param {string} phone - 手機號碼
 * @returns {boolean} 是否為有效手機號碼
 */
export const isValidTaiwanPhone = (phone) => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone?.replace(/\s|-/g, ''));
};

/**
 * 格式化檔案大小
 * @param {number} bytes - 檔案大小（位元組）
 * @returns {string} 格式化後的檔案大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 從陣列中隨機選取元素
 * @param {Array} array - 來源陣列
 * @param {number} count - 要選取的數量，預設為 1
 * @returns {any|Array} 選取的元素或元素陣列
 */
export const randomFromArray = (array, count = 1) => {
  if (!Array.isArray(array) || array.length === 0) return count === 1 ? null : [];
  
  if (count === 1) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * 顏色相關工具函數
 */
export const colorUtils = {
  /**
   * 將 HEX 顏色轉換為 RGB
   * @param {string} hex - HEX 顏色值
   * @returns {object} RGB 顏色物件
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * 將 RGB 顏色轉換為 HEX
   * @param {number} r - 紅色值
   * @param {number} g - 綠色值
   * @param {number} b - 藍色值
   * @returns {string} HEX 顏色值
   */
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * 獲取隨機顏色
   * @returns {string} 隨機 HEX 顏色值
   */
  getRandomColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
};

/**
 * 本地儲存工具函數
 */
export const storageUtils = {
  /**
   * 設定 localStorage 項目
   * @param {string} key - 鍵名
   * @param {any} value - 值
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, safeJsonStringify(value));
    } catch (error) {
      console.error('localStorage 設定錯誤:', error);
    }
  },

  /**
   * 獲取 localStorage 項目
   * @param {string} key - 鍵名
   * @param {any} defaultValue - 預設值
   * @returns {any} 儲存的值或預設值
   */
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? safeJsonParse(item, defaultValue) : defaultValue;
    } catch (error) {
      console.error('localStorage 讀取錯誤:', error);
      return defaultValue;
    }
  },

  /**
   * 移除 localStorage 項目
   * @param {string} key - 鍵名
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage 移除錯誤:', error);
    }
  },

  /**
   * 清空 localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('localStorage 清空錯誤:', error);
    }
  }
};