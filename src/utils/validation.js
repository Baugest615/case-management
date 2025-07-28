// src/utils/validation.js

/**
 * 案件表單驗證規則
 */
export const validateCaseForm = (formData) => {
  const errors = {};

  // 標題驗證
  if (!formData.title || !formData.title.trim()) {
    errors.title = '請輸入案件標題';
  } else if (formData.title.trim().length < 2) {
    errors.title = '案件標題至少需要2個字元';
  } else if (formData.title.trim().length > 100) {
    errors.title = '案件標題不能超過100個字元';
  }

  // 內容驗證
  if (!formData.content || !formData.content.trim()) {
    errors.content = '請輸入案件內容';
  } else if (formData.content.trim().length < 5) {
    errors.content = '案件內容至少需要5個字元';
  } else if (formData.content.trim().length > 1000) {
    errors.content = '案件內容不能超過1000個字元';
  }

  // 金額驗證
  if (formData.amount && formData.amount !== '') {
    const amount = parseInt(formData.amount);
    if (isNaN(amount)) {
      errors.amount = '請輸入有效的數字';
    } else if (amount < 0) {
      errors.amount = '金額不能為負數';
    } else if (amount > 10000000) {
      errors.amount = '金額不能超過一千萬';
    }
  }

  // 廠商名稱驗證
  if (formData.vendor && formData.vendor.trim().length > 50) {
    errors.vendor = '廠商名稱不能超過50個字元';
  }

  // 付款方式驗證
  if (formData.paymentMethod && formData.paymentMethod.trim().length > 100) {
    errors.paymentMethod = '付款方式描述不能超過100個字元';
  }

  // 標籤驗證
  if (formData.tags && Array.isArray(formData.tags)) {
    if (formData.tags.length > 10) {
      errors.tags = '標籤數量不能超過10個';
    }
    
    for (const tag of formData.tags) {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        errors.tags = '標籤不能為空';
        break;
      }
      if (tag.trim().length > 20) {
        errors.tags = '單個標籤長度不能超過20個字元';
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 通用驗證函數
 */
export const validators = {
  /**
   * 必填欄位驗證
   * @param {any} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  required: (value, fieldName = '此欄位') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName}為必填項目`;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return `${fieldName}不能為空白`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${fieldName}至少需要一個項目`;
    }
    return null;
  },

  /**
   * 最小長度驗證
   * @param {string} value - 要驗證的值
   * @param {number} minLength - 最小長度
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  minLength: (value, minLength, fieldName = '此欄位') => {
    if (value && value.length < minLength) {
      return `${fieldName}至少需要${minLength}個字元`;
    }
    return null;
  },

  /**
   * 最大長度驗證
   * @param {string} value - 要驗證的值
   * @param {number} maxLength - 最大長度
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  maxLength: (value, maxLength, fieldName = '此欄位') => {
    if (value && value.length > maxLength) {
      return `${fieldName}不能超過${maxLength}個字元`;
    }
    return null;
  },

  /**
   * 數字驗證
   * @param {any} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isNumber: (value, fieldName = '此欄位') => {
    if (value !== '' && value !== null && value !== undefined) {
      if (isNaN(Number(value))) {
        return `${fieldName}必須是有效的數字`;
      }
    }
    return null;
  },

  /**
   * 正整數驗證
   * @param {any} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isPositiveInteger: (value, fieldName = '此欄位') => {
    if (value !== '' && value !== null && value !== undefined) {
      const num = Number(value);
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        return `${fieldName}必須是正整數`;
      }
    }
    return null;
  },

  /**
   * Email 格式驗證
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isEmail: (value, fieldName = 'Email') => {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${fieldName}格式不正確`;
      }
    }
    return null;
  },

  /**
   * 手機號碼格式驗證（台灣）
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isTaiwanPhone: (value, fieldName = '手機號碼') => {
    if (value) {
      const phoneRegex = /^09\d{8}$/;
      const cleanPhone = value.replace(/\s|-/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return `${fieldName}格式不正確（應為09開頭的10位數字）`;
      }
    }
    return null;
  },

  /**
   * URL 格式驗證
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isUrl: (value, fieldName = 'URL') => {
    if (value) {
      try {
        new URL(value);
        return null;
      } catch {
        return `${fieldName}格式不正確`;
      }
    }
    return null;
  },

  /**
   * 日期格式驗證
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isDate: (value, fieldName = '日期') => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return `${fieldName}格式不正確`;
      }
    }
    return null;
  },

  /**
   * 未來日期驗證
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isFutureDate: (value, fieldName = '日期') => {
    if (value) {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        return `${fieldName}必須是未來的日期`;
      }
    }
    return null;
  },

  /**
   * 過去日期驗證
   * @param {string} value - 要驗證的值
   * @param {string} fieldName - 欄位名稱
   * @returns {string|null} 錯誤訊息或 null
   */
  isPastDate: (value, fieldName = '日期') => {
    if (value) {
      const date = new Date(value);
      const now = new Date();
      if (date >= now) {
        return `${fieldName}必須是過去的日期`;
      }
    }
    return null;
  }
};

/**
 * 執行多個驗證規則
 * @param {any} value - 要驗證的值
 * @param {Array} rules - 驗證規則陣列
 * @param {string} fieldName - 欄位名稱
 * @returns {string|null} 第一個錯誤訊息或 null
 */
export const runValidation = (value, rules, fieldName) => {
  for (const rule of rules) {
    const error = rule(value, fieldName);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * 表單整體驗證
 * @param {object} formData - 表單資料
 * @param {object} validationRules - 驗證規則物件
 * @returns {object} 驗證結果
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const fieldValue = formData[fieldName];
    const error = runValidation(fieldValue, rules, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 即時驗證 Hook 用的驗證函數
 * @param {any} value - 要驗證的值
 * @param {Array} rules - 驗證規則
 * @param {string} fieldName - 欄位名稱
 * @returns {object} 驗證結果
 */
export const validateField = (value, rules, fieldName) => {
  const error = runValidation(value, rules, fieldName);
  return {
    isValid: !error,
    error
  };
};