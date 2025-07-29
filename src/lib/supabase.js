// src/lib/supabase.js - 修正版本
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// 修正測試連線函數
export const testConnection = async () => {
  try {
    // 修正：使用簡單的 select 查詢而不是 count
    const { data, error } = await supabase
      .from('cases')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: '資料庫連線成功' };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, message: error.message };
  }
};