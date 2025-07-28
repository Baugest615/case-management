// app/page.js - 除錯版本
'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Calendar, User, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CaseManagementSystem() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('檢查中...');

  // 檢查連線和載入資料
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      setConnectionStatus('檢查連線中...');

      // 檢查環境變數
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      console.log('Environment check:');
      console.log('SUPABASE_URL exists:', !!supabaseUrl);
      console.log('SUPABASE_KEY exists:', !!supabaseKey);
      console.log('SUPABASE_URL:', supabaseUrl?.substring(0, 30) + '...'); // 只顯示前30字元

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('環境變數未設定！請檢查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }

      setConnectionStatus('嘗試連線到資料庫...');

      // 測試連線
      const { data, error } = await supabase
        .from('cases')
        .select('count(*)', { count: 'exact' });

      if (error) {
        console.error('Database connection error:', error);
        throw new Error(`資料庫連線錯誤: ${error.message}`);
      }

      setConnectionStatus('連線成功，載入資料中...');

      // 載入實際資料
      const { data: casesData, error: fetchError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Data fetch error:', fetchError);
        throw new Error(`資料載入錯誤: ${fetchError.message}`);
      }

      console.log('載入的資料:', casesData);
      setCases(casesData || []);
      setConnectionStatus(`成功載入 ${casesData?.length || 0} 筆資料`);

    } catch (error) {
      console.error('Connection/Loading error:', error);
      setError(error.message);
      setConnectionStatus('連線失敗');
    } finally {
      setLoading(false);
    }
  };

  // 建立測試資料的函數
  const createTestData = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            title: '測試案件',
            content: '這是一個測試案件',
            category: '測試',
            status: '進行中',
            amount: 1000,
            vendor: '測試廠商',
            tags: ['測試', '範例']
          }
        ])
        .select();

      if (error) throw error;

      alert('測試資料建立成功！');
      checkConnection(); // 重新載入資料
    } catch (error) {
      console.error('建立測試資料錯誤:', error);
      alert(`建立測試資料失敗: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">案件管理系統</h1>
          <div className="text-center py-8">
            <div className="text-xl mb-4">載入中...</div>
            <div className="text-gray-600">{connectionStatus}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">案件管理系統</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">連線錯誤</h2>
            <p className="text-red-700 mb-4">{error}</p>
            
            <div className="space-y-2 text-sm text-red-600 mb-4">
              <p><strong>可能的解決方案：</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>檢查 Vercel 專案的環境變數設定</li>
                <li>確認 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 正確</li>
                <li>檢查 Supabase 專案是否正常運作</li>
                <li>確認資料表 'cases' 是否存在</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={checkConnection}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                重新嘗試連線
              </button>
              <button
                onClick={createTestData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                建立測試資料
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">除錯資訊：</h3>
            <p>狀態: {connectionStatus}</p>
            <p>資料筆數: {cases.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">案件管理系統</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <p className="text-green-700">✅ {connectionStatus}</p>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">目前沒有案件資料</p>
            <button
              onClick={createTestData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              建立測試資料
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {cases.map((case_) => (
              <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                    <p className="text-gray-600 mt-1">{case_.content}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    case_.status === '已完成' ? 'bg-green-100 text-green-800' :
                    case_.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {case_.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span>{case_.category || '未分類'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{case_.vendor || '未指定'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(case_.created_at).toLocaleDateString('zh-TW')}</span>
                  </div>
                </div>
                
                {case_.amount && (
                  <div className="mt-2 text-lg font-semibold text-green-600">
                    NT$ {case_.amount.toLocaleString()}
                  </div>
                )}
                
                {case_.tags && case_.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {case_.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}