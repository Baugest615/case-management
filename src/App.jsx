// src/App.jsx - 完整功能版本
import React, { useState } from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import CaseStats from './components/case/CaseStats';
import CaseForm from './components/case/CaseForm';
import { useCases } from './hooks/useCases';
import { useSearch } from './hooks/useSearch';
import { STATUS_COLORS } from './utils/constants';

function App() {
  const [showManagement, setShowManagement] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // 使用自定義 hooks
  const { 
    cases, 
    loading, 
    error, 
    addCase, 
    updateCase, 
    deleteCase, 
    getStats,
    clearError 
  } = useCases();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredData: filteredCases
  } = useSearch(cases);

  // 處理新增案件
  const handleAddCase = (caseData) => {
    const result = addCase(caseData);
    if (result.success) {
      setShowForm(false);
      alert('案件新增成功！');
    } else {
      alert(result.error);
    }
  };

  // 處理編輯案件
  const handleEditCase = (case_) => {
    setEditingCase(case_);
    setShowForm(true);
  };

  // 處理更新案件
  const handleUpdateCase = (caseData) => {
    const result = updateCase(editingCase.id, caseData);
    if (result.success) {
      setShowForm(false);
      setEditingCase(null);
      alert('案件更新成功！');
    } else {
      alert(result.error);
    }
  };

  // 處理刪除案件
  const handleDeleteCase = (id) => {
    if (window.confirm('確定要刪除這個案件嗎？')) {
      const result = deleteCase(id);
      if (result.success) {
        alert('案件已刪除');
      } else {
        alert(result.error);
      }
    }
  };

  // 關閉表單
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  // 計算統計資料
  const stats = getStats(filteredCases);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    }}>
      {/* 系統標題區域 */}
      <Card padding="large">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📋 案件管理系統 - 完整版
          </h1>

          {/* 系統狀態 */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #16a34a',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#15803d',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              ✅ 系統功能狀態
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px',
              fontSize: '14px'
            }}>
              <p>✅ 案件增刪改查</p>
              <p>✅ 搜尋與篩選</p>
              <p>✅ 統計分析</p>
              <p>✅ 標籤管理</p>
              <p>✅ 響應式設計</p>
              <p>📅 {new Date().toLocaleString('zh-TW')}</p>
            </div>
          </div>

          {/* 主要操作按鈕 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="primary"
              size="large"
              onClick={() => setShowManagement(!showManagement)}
            >
              {showManagement ? '📥 隱藏管理界面' : '📋 顯示管理界面'}
            </Button>

            {showManagement && (
              <Button
                variant="success"
                size="large"
                onClick={() => setShowForm(true)}
              >
                ➕ 新增案件
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 錯誤提示 */}
      {error && (
        <Card padding="normal" style={{ marginTop: '24px' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#dc2626' }}>⚠️ {error}</span>
            <Button
              variant="outline"
              size="small"
              onClick={clearError}
            >
              關閉
            </Button>
          </div>
        </Card>
      )}

      {/* 案件管理區域 */}
      {showManagement && (
        <div style={{ display: 'grid', gap: '24px', marginTop: '24px' }}>
          {/* 統計區域 */}
          <CaseStats stats={stats} />

          {/* 搜尋和篩選 */}
          <Card title="🔍 搜尋與篩選" padding="normal">
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <Input
                placeholder="搜尋案件標題、內容、廠商、標籤..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<span>🔍</span>}
              />
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  minWidth: '140px'
                }}
              >
                <option value="全部">全部狀態</option>
                <option value="進行中">進行中</option>
                <option value="已完成">已完成</option>
                <option value="待確認">待確認</option>
                <option value="已取消">已取消</option>
              </select>
            </div>
            
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              🔍 找到 <strong>{filteredCases.length}</strong> 個案件
              {searchTerm && ` (搜尋: "${searchTerm}")`}
              {statusFilter !== '全部' && ` (狀態: ${statusFilter})`}
            </div>
          </Card>

          {/* 案件列表 */}
          <Card padding="normal">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📝 案件列表
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {filteredCases.length} 個案件
                </span>
              </h2>
            </div>

            {filteredCases.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredCases.map((case_) => {
                  const statusColor = STATUS_COLORS[case_.status] || STATUS_COLORS['進行中'];
                  
                  return (
                    <Card 
                      key={case_.id}
                      hover
                      padding="large"
                    >
                      {/* 標題和狀態 */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div style={{ flex: 1, marginRight: '16px' }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 8px 0',
                            lineHeight: '1.4'
                          }}>
                            {case_.title}
                          </h3>
                          <p style={{
                            color: '#6b7280',
                            margin: '0',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {case_.content}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexShrink: 0
                        }}>
                          <span style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>
                            {case_.status}
                          </span>
                        </div>
                      </div>

                      {/* 詳細資訊 */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '12px',
                        fontSize: '14px',
                        marginBottom: '16px',
                        color: '#6b7280'
                      }}>
                        {case_.category && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🏷️</span>
                            <span>{case_.category}</span>
                          </div>
                        )}
                        
                        {case_.vendor && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🏢</span>
                            <span>{case_.vendor}</span>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📅</span>
                          <span>{new Date(case_.created_at).toLocaleDateString('zh-TW')}</span>
                        </div>

                        {case_.paymentMethod && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>💳</span>
                            <span>{case_.paymentMethod}</span>
                          </div>
                        )}
                      </div>

                      {/* 金額 */}
                      {case_.amount > 0 && (
                        <div style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#16a34a',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          💰 NT$ {case_.amount.toLocaleString()}
                        </div>
                      )}

                      {/* 標籤 */}
                      {case_.tags && case_.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginBottom: '16px'
                        }}>
                          {case_.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                border: '1px solid #e5e7eb'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 操作按鈕 */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        paddingTop: '16px',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleEditCase(case_)}
                        >
                          ✏️ 編輯
                        </Button>
                        
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteCase(case_.id)}
                        >
                          🗑️ 刪除
                        </Button>
                      </div>

                      {/* 更新時間（如果有） */}
                      {case_.updated_at && (
                        <div style={{
                          fontSize: '11px',
                          color: '#9ca3af',
                          textAlign: 'right',
                          marginTop: '8px'
                        }}>
                          最後更新: {new Date(case_.updated_at).toLocaleString('zh-TW')}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {searchTerm || statusFilter !== '全部' ? '🔍' : '📋'}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  {searchTerm || statusFilter !== '全部' ? '沒有找到符合條件的案件' : '還沒有任何案件'}
                </h3>
                <p style={{
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  {searchTerm || statusFilter !== '全部' 
                    ? '試試調整搜尋關鍵字或篩選條件' 
                    : '點擊上方的「新增案件」按鈕來建立第一個案件'
                  }
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 案件表單 Modal */}
      <CaseForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={editingCase ? handleUpdateCase : handleAddCase}
        editingCase={editingCase}
      />
    </div>
  );
}

export default App;