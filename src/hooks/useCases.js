// src/hooks/useCases.js - 完整資料庫版本
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('未連線');

  // 初始化：測試連線並載入資料
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      setConnectionStatus('載入資料中...');
      await fetchCases();
      setConnectionStatus('連線成功');
    } catch (err) {
      console.error('初始化錯誤:', err);
      setError(err.message);
      setConnectionStatus('連線失敗');
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // 載入模擬資料（備案）
  const loadFallbackData = () => {
    const fallbackData = [
      {
        id: 1,
        category: '機票',
        title: '陳總香港商務出差',
        content: '商務艙來回機票',
        client: '陳總',
        startDate: '2024-01-16',
        endDate: '2024-01-19',
        vendor: 'KGI',
        bookingDate: '2024-01-10',
        amount: 8500,
        hasCreditCardFee: true,
        finalAmount: 8628,
        paymentMethod: '台新-線上刷卡',
        paymentDate: '2024-01-10',
        airlineCode: 'CI',
        remarks: '商務艙來回機票',
        status: '已完成',
        created_at: '2024-01-10T10:00:00Z'
      }
    ];
    setCases(fallbackData);
  };

  // 從資料庫載入案件
  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // 轉換資料格式以符合前端顯示
      const processedData = (data || []).map(item => ({
        ...item,
        // 轉換資料庫欄位名稱為前端格式
        startDate: item.start_date,
        endDate: item.end_date,
        bookingDate: item.booking_date,
        hasCreditCardFee: item.has_credit_card_fee,
        finalAmount: item.final_amount,
        paymentMethod: item.payment_method,
        paymentDate: item.payment_date,
        airlineCode: item.airline_code,
        // 確保必要欄位存在
        client: item.client || '',
        remarks: item.remarks || item.content || '',
        amount: item.amount || 0,
        vendor: item.vendor || '',
        status: item.status || '進行中'
      }));
      
      setCases(processedData);
      console.log('資料載入成功:', processedData.length, '筆案件');
      
    } catch (err) {
      console.error('載入資料錯誤:', err);
      setError(`載入資料失敗: ${err.message}`);
      throw err; // 重新拋出錯誤以觸發備案資料
    } finally {
      setLoading(false);
    }
  };

  // 新增案件 - 使用完整的新欄位
  const addCase = async (caseData) => {
    try {
      if (!caseData.category || !caseData.title?.trim()) {
        throw new Error('請選擇案件分類並填寫案件標題');
      }

      setLoading(true);
      
      // 包含所有新欄位的資料
      const newCaseData = {
        // 基本欄位
        category: caseData.category,
        title: caseData.title.trim(),
        content: caseData.remarks || caseData.title, // 使用備註作為內容，或標題作為備案
        status: caseData.status || '進行中',
        
        // 舊有欄位
        vendor: caseData.vendor || null,
        amount: caseData.amount ? parseInt(caseData.amount) : null,
        payment_method: caseData.paymentMethod || '未付款',
        tags: [], // 暫時設為空陣列
        
        // 新增欄位 (資料庫欄位名稱)
        client: caseData.client || null,
        start_date: caseData.startDate || null,
        end_date: caseData.endDate || null,
        booking_date: caseData.bookingDate || null,
        has_credit_card_fee: caseData.hasCreditCardFee || false,
        final_amount: caseData.finalAmount ? parseInt(caseData.finalAmount) : null,
        payment_date: caseData.paymentDate || null,
        airline_code: caseData.airlineCode || null,
        remarks: caseData.remarks || null
      };

      console.log('準備新增案件:', newCaseData);

      const { data, error } = await supabase
        .from('cases')
        .insert([newCaseData])
        .select()
        .single();

      if (error) {
        console.error('Supabase 錯誤:', error);
        throw error;
      }

      // 轉換資料格式以符合前端顯示
      const displayData = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        bookingDate: data.booking_date,
        hasCreditCardFee: data.has_credit_card_fee,
        finalAmount: data.final_amount,
        paymentMethod: data.payment_method,
        paymentDate: data.payment_date,
        airlineCode: data.airline_code
      };

      // 更新本地狀態
      setCases([displayData, ...cases]);
      
      console.log('案件新增成功:', displayData);
      return { success: true, data: displayData };
      
    } catch (err) {
      console.error('新增案件錯誤:', err);
      const errorMessage = `新增失敗: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 更新案件 - 使用完整的新欄位
  const updateCase = async (id, caseData) => {
    try {
      if (!caseData.category || !caseData.title?.trim()) {
        throw new Error('請選擇案件分類並填寫案件標題');
      }

      setLoading(true);

      // 包含所有欄位的更新資料
      const updateData = {
        // 基本欄位
        category: caseData.category,
        title: caseData.title.trim(),
        content: caseData.remarks || caseData.title,
        status: caseData.status || '進行中',
        updated_at: new Date().toISOString(),
        
        // 舊有欄位
        vendor: caseData.vendor || null,
        amount: caseData.amount ? parseInt(caseData.amount) : null,
        payment_method: caseData.paymentMethod || '未付款',
        
        // 新增欄位 (資料庫欄位名稱)
        client: caseData.client || null,
        start_date: caseData.startDate || null,
        end_date: caseData.endDate || null,
        booking_date: caseData.bookingDate || null,
        has_credit_card_fee: caseData.hasCreditCardFee || false,
        final_amount: caseData.finalAmount ? parseInt(caseData.finalAmount) : null,
        payment_date: caseData.paymentDate || null,
        airline_code: caseData.airlineCode || null,
        remarks: caseData.remarks || null
      };

      console.log('準備更新案件:', updateData);

      const { data, error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase 更新錯誤:', error);
        throw error;
      }

      // 轉換資料格式
      const displayData = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        bookingDate: data.booking_date,
        hasCreditCardFee: data.has_credit_card_fee,
        finalAmount: data.final_amount,
        paymentMethod: data.payment_method,
        paymentDate: data.payment_date,
        airlineCode: data.airline_code
      };

      // 更新本地狀態
      setCases(cases.map(c => c.id === id ? displayData : c));
      
      console.log('案件更新成功:', displayData);
      return { success: true, data: displayData };
      
    } catch (err) {
      console.error('更新案件錯誤:', err);
      const errorMessage = `更新失敗: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 刪除案件
  const deleteCase = async (id) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 更新本地狀態
      setCases(cases.filter(c => c.id !== id));
      
      console.log('案件刪除成功:', id);
      return { success: true };
      
    } catch (err) {
      console.error('刪除案件錯誤:', err);
      const errorMessage = `刪除失敗: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 重新載入資料
  const refreshCases = async () => {
    await fetchCases();
  };

  // 取得案件統計
  const getStats = (filteredCases = cases) => {
    return {
      total: filteredCases.length,
      completed: filteredCases.filter(c => c.status === '已完成').length,
      inProgress: filteredCases.filter(c => c.status === '進行中').length,
      pending: filteredCases.filter(c => c.status === '待確認').length,
      cancelled: filteredCases.filter(c => c.status === '已取消').length,
      totalAmount: filteredCases.reduce((sum, c) => sum + (c.finalAmount || c.amount || 0), 0),
      paidAmount: filteredCases
        .filter(c => c.paymentMethod !== '未付款' && c.paymentDate)
        .reduce((sum, c) => sum + (c.finalAmount || c.amount || 0), 0),
      unpaidAmount: filteredCases
        .filter(c => c.paymentMethod === '未付款' || !c.paymentDate)
        .reduce((sum, c) => sum + (c.finalAmount || c.amount || 0), 0)
    };
  };

  // 清除錯誤
  const clearError = () => setError(null);

  return {
    cases,
    loading,
    error,
    connectionStatus,
    addCase,
    updateCase,
    deleteCase,
    refreshCases,
    getStats,
    clearError
  };
};