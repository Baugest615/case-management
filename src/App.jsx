// src/App.jsx - 環境變數測試版本
import React from 'react';

function App() {
  console.log('Environment variables check:');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1e40af' }}>🔧 環境變數測試</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h2>環境變數檢查結果：</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <p>
            <strong>VITE_SUPABASE_URL:</strong>{' '}
            <span style={{ 
              color: import.meta.env.VITE_SUPABASE_URL ? 'green' : 'red' 
            }}>
              {import.meta.env.VITE_SUPABASE_URL || '❌ 未設定'}
            </span>
          </p>
          <p>
            <strong>VITE_SUPABASE_ANON_KEY:</strong>{' '}
            <span style={{ 
              color: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'green' : 'red' 
            }}>
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已設定' : '❌ 未設定'}
            </span>
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: import.meta.env.VITE_SUPABASE_URL ? '#f0fdf4' : '#fef2f2',
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${import.meta.env.VITE_SUPABASE_URL ? '#16a34a' : '#dc2626'}`
      }}>
        <p style={{ 
          color: import.meta.env.VITE_SUPABASE_URL ? '#15803d' : '#dc2626',
          fontWeight: 'bold',
          margin: 0
        }}>
          {import.meta.env.VITE_SUPABASE_URL 
            ? '✅ 環境變數設定正確，可以載入完整應用' 
            : '❌ 環境變數未設定，請在 Vercel 中設定後重新部署'
          }
        </p>
      </div>
    </div>
  );
}

export default App;