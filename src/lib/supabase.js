// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 檢查環境變數
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', !!supabaseKey);
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 測試連線
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('count(*)', { count: 'exact' });
    
    if (error) throw error;
    return { success: true, message: '資料庫連線成功' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};