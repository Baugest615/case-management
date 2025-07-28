// src/utils/constants.js
export const CASE_CATEGORIES = [
  '差旅', '住宿', '場地', '餐飲', '交通', '會議', '設備', '服務'
];

export const CASE_STATUSES = [
  '進行中', '已完成', '待確認', '已取消'
];

export const VENDORS = [
  'KGI', 'EXPEDIA', '台中場台足球俱樂部', 'TRIP', 'SHAIJK', '台灣高鐵'
];

export const PAYMENT_METHODS = [
  '台新-線上刷卡', '現金', 'EXPEDIA 訂房(AE卡)', 'TRIP 1/3付款', '銀行轉帳'
];

export const COMMON_TAGS = [
  '機票', '住宿', '會議', '出差', '台中', '香港', '商務', '場地租借', '交通', '餐飲'
];

export const STATUS_COLORS = {
  '已完成': { bg: '#dcfce7', text: '#166534' },
  '進行中': { bg: '#dbeafe', text: '#1e40af' },
  '待確認': { bg: '#fef3c7', text: '#92400e' },
  '已取消': { bg: '#fecaca', text: '#dc2626' }
};