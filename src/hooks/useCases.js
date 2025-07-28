// src/hooks/useCases.js - Supabase 整合版本
import { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabase';

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
      // 測試連線
      setConnectionStatus('測試連線中...');
      const connectionTest = await testConnection();
      
      if (!connectionTest.success) {
        throw new Error(`連線失敗: ${connectionTest.message}`);
      }
      
      setConnectionStatus('連線成功');
      
      // 載入資料
      await fetchCases();
      
    } catch (err) {
      console.error('初始化錯誤:', err);
      setError(err.message);
      setConnectionStatus('連線失敗');
      
      // 如果連線失敗，載入模擬資料作為備案
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
        title: '機票訂購 (模擬資料)',
        content: '陳總-香港(CI) 1/16-1/19',
        category: '差旅',
        status: '已完成',
        amount: 8500,
        vendor: 'KGI',
        payment_method: '台新-線上刷卡1/10',
        tags: ['機票', '香港', '出差'],
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
      
      setCases(data || []);
      console.log('資料載入成功:', data?.length || 0, '筆案件');
      
    } catch (err) {
      console.error('載入資料錯誤:', err);
      setError(`載入資料失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 新增案件
  const addCase = async (caseData) => {
    try {
      if (!caseData.title?.trim() || !caseData.content?.trim()) {
        throw new Error('請填寫案件標題和內容');
      }

      setLoading(true);
      
      const newCaseData = {
        title: caseData.title.trim(),
        content: caseData.content.trim(),
        category: caseData.category || null,
        status: caseData.status || '進行中',
        amount: caseData.amount ? parseInt(caseData.amount) : null,
        vendor: caseData.vendor || null,
        payment_method: caseData.paymentMethod || null,
        tags: caseData.tags || []
      };

      const { data, error } = await supabase
        .from('cases')
        .insert([newCaseData])
        .select()
        .single();

      if (error) throw error;

      // 更新本地狀態
      setCases([data, ...cases]);
      
      console.log('案件新增成功:', data);
      return { success: true, data };
      
    } catch (err) {
      console.error('新增案件錯誤:', err);
      const errorMessage = `新增失敗: ${err.message}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 更新案件
  const updateCase = async (id, caseData) => {
    try {
      if (!caseData.title?.trim() || !caseData.content?.trim()) {
        throw new Error('請填寫案件標題和內容');
      }

      setLoading(true);

      const updateData = {
        title: caseData.title.trim(),
        content: caseData.content.trim(),
        category: caseData.category || null,
        status: caseData.status || '進行中',
        amount: caseData.amount ? parseInt(caseData.amount) : null,
        vendor: caseData.vendor || null,
        payment_method: caseData.paymentMethod || null,
        tags: caseData.tags || [],
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 更新本地狀態
      setCases(cases.map(c => c.id === id ? data : c));
      
      console.log('案件更新成功:', data);
      return { success: true, data };
      
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
      totalAmount: filteredCases.reduce((sum, c) => sum + (c.amount || 0), 0)
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