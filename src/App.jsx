// src/App.jsx - 修復 Export 問題
import React, { useState } from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import CaseStats from './components/case/CaseStats';
import CaseForm from './components/case/CaseForm';
import { useCases } from './hooks/useCases';
import { useSearch } from './hooks/useSearch';
import { STATUS_COLORS } from './utils/constants';
import './App.css'; // 引入外部 CSS

function App() {
  const [showManagement, setShowManagement] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // 使用自定義 hooks
  const { 
    cases, 
    loading, 
    error, 
    connectionStatus,
    addCase, 
    updateCase, 
    deleteCase, 
    getStats,
    clearError,
    refreshCases
  } = useCases();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredData: filteredCases
  } = useSearch(cases);

  // 處理新增案件
  const handleAddCase = async (caseData) => {
    try {
      const result = await addCase(caseData);
      if (result.success) {
        setShowForm(false);
        alert('✅ 案件新增成功！');
      } else {
        alert('❌ ' + result.error);
      }
    } catch (error) {
      alert('❌ 新增失敗：' + error.message);
    }
  };

  // 處理編輯案件
  const handleEditCase = (case_) => {
    setEditingCase(case_);
    setShowForm(true);
  };

  // 處理更新案件
  const handleUpdateCase = async (caseData) => {
    try {
      const result = await updateCase(editingCase.id, caseData);
      if (result.success) {
        setShowForm(false);
        setEditingCase(null);
        alert('✅ 案件更新成功！');
      } else {
        alert('❌ ' + result.error);
      }
    } catch (error) {
      alert('❌ 更新失敗：' + error.message);
    }
  };

  // 處理刪除案件
  const handleDeleteCase = async (id) => {
    if (window.confirm('⚠️ 確定要刪除這個案件嗎？')) {
      try {
        const result = await deleteCase(id);
        if (result.success) {
          alert('✅ 案件已刪除');
        } else {
          alert('❌ ' + result.error);
        }
      } catch (error) {
        alert('❌ 刪除失敗：' + error.message);
      }
    }
  };

  // 關閉表單
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  // 重置篩選
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('全部');
  };

  // 檢查是否有活動篩選
  const hasActiveFilters = searchTerm !== '' || statusFilter !== '全部';

  // 計算統計資料
  const stats = getStats(filteredCases);

  return (
    <div className="app-container">
      
      {/* 系統標題區域 */}
      <div className="title-section">
        <Card padding="large">
          <div className="title-content">
            <h1 className="main-title">
              📋 案件管理系統
            </h1>

            {/* 連線狀態顯示 */}
            <div className={`connection-status ${connectionStatus === '連線成功' ? 'success' : 
                            connectionStatus === '連線失敗' ? 'error' : 'loading'}`}>
              <span>
                {connectionStatus === '連線成功' ? '✅' : 
                 connectionStatus === '連線失敗' ? '❌' : '⏳'} 
                資料庫狀態: {connectionStatus}
              </span>
              
              {connectionStatus === '連線失敗' && (
                <div className="reconnect-section">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={refreshCases}
                    disabled={loading}
                  >
                    🔄 重新連線
                  </Button>
                </div>
              )}
            </div>

            {/* 主要操作按鈕 */}
            <div className="main-buttons">
              <Button
                variant="primary"
                size="large"
                onClick={() => setShowManagement(!showManagement)}
                className="main-button"
              >
                {showManagement ? '📥 隱藏管理' : '📋 案件管理'}
              </Button>

              {showManagement && (
                <Button
                  variant="success"
                  size="large"
                  onClick={() => setShowForm(true)}
                  disabled={loading}
                  className="add-button"
                >
                  ➕ 新增案件
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 錯誤提示 */}
      {error && (
        <div className="error-section">
          <Card padding="normal">
            <div className="error-message">
              <div className="error-content">
                <div className="error-title">
                  ⚠️ 系統錯誤
                </div>
                <div className="error-text">
                  {error}
                </div>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={clearError}
              >
                ✕
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 案件管理區域 */}
      {showManagement && (
        <div className="management-section">
          
          {/* 統計區域 */}
          <CaseStats stats={stats} />

          {/* 搜尋和篩選 */}
          <Card title="🔍 搜尋與篩選" padding="normal">
            <div className="search-container">
              {/* 搜尋輸入框 */}
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="搜尋案件標題、內容、廠商..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon">
                  🔍
                </div>
              </div>
              
              {/* 狀態篩選下拉選單 */}
              <div className="filter-container">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="全部">全部狀態</option>
                  <option value="進行中">進行中</option>
                  <option value="已完成">已完成</option>
                  <option value="待確認">待確認</option>
                  <option value="已取消">已取消</option>
                </select>
              </div>
            </div>
            
            {/* 搜尋結果資訊 */}
            <div className="search-results">
              <div>
                🔍 找到 <strong>{filteredCases.length}</strong> 個案件
                {searchTerm && ` (搜尋: "${searchTerm}")`}
                {statusFilter !== '全部' && ` (狀態: ${statusFilter})`}
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="reset-filters-btn"
                >
                  🔄 重置篩選
                </button>
              )}
            </div>
          </Card>

          {/* 案件列表 */}
          <Card padding="normal">
            <div className="case-list-header">
              <h2 className="case-list-title">
                📝 案件列表
                <span className="case-count">
                  {filteredCases.length} 個案件
                </span>
              </h2>
            </div>

            {filteredCases.length > 0 ? (
              <div className="case-list">
                {filteredCases.map((case_) => {
                  const statusColor = STATUS_COLORS[case_.status] || STATUS_COLORS['進行中'];
                  const isPaid = case_.paymentMethod !== '未付款' && case_.paymentDate;
                  
                  return (
                    <Card 
                      key={case_.id}
                      hover
                      padding="large"
                      className="case-card"
                    >
                      {/* 標題區域 */}
                      <div className="case-header">
                        <div className="case-title-section">
                          <div className="case-badges">
                            <span className="category-badge">
                              {case_.category}
                            </span>
                            {case_.client && (
                              <span className="client-badge">
                                👤 {case_.client}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="case-title">
                            {case_.title}
                          </h3>
                          
                          {case_.remarks && (
                            <p className="case-remarks">
                              {case_.remarks}
                            </p>
                          )}
                        </div>

                        <div className="case-status-section">
                          <span 
                            className="status-badge"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text
                            }}
                          >
                            {case_.status}
                          </span>
                          
                          {/* 付款狀態指示器 */}
                          <span className={`payment-badge ${isPaid ? 'paid' : 'unpaid'}`}>
                            {isPaid ? '✅ 已付款' : '⏰ 未付款'}
                          </span>
                        </div>
                      </div>

                      {/* 詳細資訊區域 */}
                      <div className="case-details">
                        {/* 進行日期 */}
                        {(case_.startDate || case_.endDate) && (
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div className="detail-content">
                              <div className="detail-label">進行日期</div>
                              <div className="detail-value">
                                {case_.startDate && new Date(case_.startDate).toLocaleDateString('zh-TW')}
                                {case_.startDate && case_.endDate && ' ~ '}
                                {case_.endDate && new Date(case_.endDate).toLocaleDateString('zh-TW')}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* 合作廠商 */}
                        {case_.vendor && (
                          <div className="detail-item">
                            <span className="detail-icon">🏢</span>
                            <div className="detail-content">
                              <div className="detail-label">合作廠商</div>
                              <div className="detail-value">{case_.vendor}</div>
                            </div>
                          </div>
                        )}

                        {/* 開票/訂房時間 */}
                        {case_.bookingDate && (
                          <div className="detail-item">
                            <span className="detail-icon">🎫</span>
                            <div className="detail-content">
                              <div className="detail-label">開票/訂房</div>
                              <div className="detail-value">
                                {new Date(case_.bookingDate).toLocaleDateString('zh-TW')}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 付款方式 */}
                        <div className="detail-item">
                          <span className="detail-icon">💳</span>
                          <div className="detail-content">
                            <div className="detail-label">付款方式</div>
                            <div className="detail-value">{case_.paymentMethod}</div>
                          </div>
                        </div>

                        {/* 付款日期 */}
                        {case_.paymentDate && (
                          <div className="detail-item">
                            <span className="detail-icon">📆</span>
                            <div className="detail-content">
                              <div className="detail-label">付款日期</div>
                              <div className="detail-value">
                                {new Date(case_.paymentDate).toLocaleDateString('zh-TW')}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 電代 (僅機票顯示) */}
                        {case_.category === '機票' && case_.airlineCode && (
                          <div className="detail-item">
                            <span className="detail-icon">✈️</span>
                            <div className="detail-content">
                              <div className="detail-label">電代</div>
                              <div className="detail-value">{case_.airlineCode}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 金額區域 */}
                      {(case_.amount > 0 || case_.finalAmount > 0) && (
                        <div className="amount-section">
                          <div className="amount-container">
                            <div className="amount-info">
                              {case_.amount !== case_.finalAmount && case_.hasCreditCardFee && (
                                <div className="original-amount">
                                  原金額: NT$ {parseInt(case_.amount || 0).toLocaleString()}
                                </div>
                              )}
                              <div className="final-amount">
                                💰 NT$ {parseInt(case_.finalAmount || case_.amount || 0).toLocaleString()}
                                {case_.hasCreditCardFee && (
                                  <span className="fee-badge">
                                    含手續費
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="payment-status">
                              <div className={`payment-indicator ${isPaid ? 'paid' : 'unpaid'}`}>
                                {isPaid ? '✅ 已收款' : '⏰ 待收款'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 操作按鈕 */}
                      <div className="case-actions">
                        <Button
                          variant="secondary"
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

                      {/* 建立時間 */}
                      <div className="case-timestamps">
                        建立時間: {new Date(case_.created_at).toLocaleString('zh-TW')}
                        {case_.updated_at && (
                          <span>
                            | 更新: {new Date(case_.updated_at).toLocaleString('zh-TW')}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              // 空狀態
              <div className="empty-state">
                <div className="empty-icon">
                  {searchTerm || statusFilter !== '全部' ? '🔍' : '📋'}
                </div>
                <h3 className="empty-title">
                  {searchTerm || statusFilter !== '全部' ? '沒有找到符合條件的案件' : '還沒有任何案件'}
                </h3>
                <p className="empty-description">
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

      {/* 載入遮罩 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner" />
            <div className="loading-text">
              處理中...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 確保有正確的 default export
export default App;