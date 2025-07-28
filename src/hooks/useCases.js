// src/hooks/useCases.js - 完整版本
import { useState, useEffect } from 'react';

const INITIAL_CASE_DATA = [
  {
    id: 1,
    title: '機票訂購',
    content: '陳總-香港(CI) 1/16-1/19',
    category: '差旅',
    status: '已完成',
    amount: 8500,
    vendor: 'KGI',
    paymentMethod: '台新-線上刷卡1/10',
    tags: ['機票', '香港', '出差'],
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 2,
    title: '飯店住宿', 
    content: '都雅山景商務飯店-經典雙人房',
    category: '住宿',
    status: '進行中',
    amount: 4400,
    vendor: 'EXPEDIA',
    paymentMethod: 'EXPEDIA 訂房(AE卡)',
    tags: ['住宿', '台中', '商務'],
    created_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 3,
    title: '會議場地',
    content: '台中場台足球俱樂部會議室租借',
    category: '場地',
    status: '待確認',
    amount: 49000,
    vendor: '台中場台足球俱樂部',
    paymentMethod: '連絡1/6簡總',
    tags: ['會議', '台中', '場地租借'],
    created_at: '2024-02-08T09:15:00Z'
  }
];

export const useCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCases(INITIAL_CASE_DATA);
  }, []);

  const addCase = (caseData) => {
    try {
      if (!caseData.title?.trim() || !caseData.content?.trim()) {
        throw new Error('請填寫案件標題和內容');
      }

      const newCase = {
        id: Math.max(...cases.map(c => c.id), 0) + 1,
        ...caseData,
        amount: caseData.amount ? parseInt(caseData.amount) : 0,
        created_at: new Date().toISOString()
      };

      setCases([newCase, ...cases]);
      return { success: true, data: newCase };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateCase = (id, caseData) => {
    try {
      if (!caseData.title?.trim() || !caseData.content?.trim()) {
        throw new Error('請填寫案件標題和內容');
      }

      const updatedCase = {
        ...cases.find(c => c.id === id),
        ...caseData,
        amount: caseData.amount ? parseInt(caseData.amount) : 0,
        updated_at: new Date().toISOString()
      };

      setCases(cases.map(c => c.id === id ? updatedCase : c));
      return { success: true, data: updatedCase };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteCase = (id) => {
    try {
      setCases(cases.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

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

  const clearError = () => setError(null);

  return {
    cases,
    loading,
    error,
    addCase,
    updateCase,
    deleteCase,
    getStats,
    clearError
  };
};