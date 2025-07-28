// src/App.jsx - 最簡工作版本
import React, { useState } from 'react';

function App() {
  const [showDemo, setShowDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 模擬資料
  const demoData = [
    {
      id: 1,
      title: '機票訂購',
      content: '陳總-香港(CI) 1/16-1/19',
      category: '差旅',
      status: '已完成',
      amount: 8500,
      vendor: 'KGI',
      tags: ['機票', '香港', '出差'],
      created_at: '2024-01-10'
    },
    {
      id: 2,
      title: '飯店住宿', 
      content: '都雅山景商務飯店',
      category: '住宿',
      status: '進行中',
      amount: 4400,
      vendor: 'EXPEDIA',
      tags: ['住宿', '台中', '商務'],
      created_at: '2024-01-15'
    },
    {
      id: 3,
      title: '會議場地',
      content: '台中場台足球俱樂部會議室',
      category: '場地',
      status: '待確認',
      amount: 49000,
      vendor: '台中場台足球俱樂部',
      tags: ['會議', '台中', '場地租借'],
      created_at: '2024-02-08'
    }
  ];

  // 過濾資料
  const filteredData = demoData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    }}>
      {/* 標題區域 */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          📋 案件管理系統
        </h1>

        {/* 系統狀態 */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #16a34a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            color: '#15803d',
            margin: '0 0 10px 0'
          }}>
            ✅ 系統狀態檢查
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✅ React 運行正常
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✅ Vite 開發伺服器啟動成功
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            ✅ 基本功能可用
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            📅 測試時間: {new Date().toLocaleString('zh-TW')}
          </p>
        </div>

        {/* 功能按鈕 */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setShowDemo(!showDemo)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '12px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            {showDemo ? '📥 隱藏案件列表' : '📋 顯示案件列表'}
          </button>
          
          <button
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
            onClick={() => alert('準備連接 Supabase 資料庫！')}
          >
            🔗 連接資料庫
          </button>
        </div>
      </div>

      {/* 案件管理區域 */}
      {showDemo && (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            📝 案件管理功能
          </h2>

          {/* 搜尋和操作區 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#6b7280' }}>🔍</span>
              <input 
                type="text"
                placeholder="搜尋案件標題、內容、廠商..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                ➕ 新增案件
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#6b7280' }}>快速篩選:</span>
              <button style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '12px', padding: '2px 8px' }}>
                全部
              </button>
              <button style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '12px', padding: '2px 8px' }}>
                進行中
              </button>
              <button style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '12px', padding: '2px 8px' }}>
                已完成
              </button>
            </div>
          </div>

          {/* 統計資訊 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '12px', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>
                {filteredData.length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>總案件數</div>
            </div>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '12px', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {filteredData.filter(item => item.status === '已完成').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>已完成</div>
            </div>
            <div style={{ 
              backgroundColor: '#fefce8', 
              padding: '12px', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                NT$ {filteredData.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>總金額</div>
            </div>
          </div>

          {/* 案件列表 */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredData.map((case_) => (
              <div 
                key={case_.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {case_.title}
                    </h3>
                    <p style={{ 
                      color: '#6b7280',
                      margin: '0',
                      fontSize: '14px'
                    }}>
                      {case_.content}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: 
                        case_.status === '已完成' ? '#dcfce7' : 
                        case_.status === '進行中' ? '#dbeafe' : '#fef3c7',
                      color: 
                        case_.status === '已完成' ? '#166534' : 
                        case_.status === '進行中' ? '#1e40af' : '#92400e',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {case_.status}
                    </span>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}>
                      ✏️
                    </button>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '8px',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🏷️</span>
                    <span>{case_.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🏢</span>
                    <span>{case_.vendor}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📅</span>
                    <span>{new Date(case_.created_at).toLocaleDateString('zh-TW')}</span>
                  </div>
                </div>

                {case_.amount && (
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#16a34a',
                    marginBottom: '8px'
                  }}>
                    💰 NT$ {case_.amount.toLocaleString()}
                  </div>
                )}

                {case_.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {case_.tags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p>沒有找到符合條件的案件</p>
              <p style={{ fontSize: '14px' }}>試試調整搜尋關鍵字</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;