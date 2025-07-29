// src/components/case/CaseForm.jsx - 新結構版本
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { CASE_CATEGORIES, CASE_STATUSES, CLIENTS, VENDORS, PAYMENT_METHODS } from '../../utils/constants';

const CaseForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingCase = null 
}) => {
  const [formData, setFormData] = useState({
    category: '',                    // 案件分類
    title: '',                      // 案件標題
    client: '',                     // 委託人
    startDate: '',                  // 進行開始日期
    endDate: '',                    // 進行結束日期
    vendor: '',                     // 合作廠商
    bookingDate: '',                // 開票/訂房時間
    amount: '',                     // 應收金額
    hasCreditCardFee: false,        // 是否有信用卡手續費
    finalAmount: '',                // 最終金額（含手續費）
    paymentMethod: '未付款',         // 付款方式
    paymentDate: '',                // 付款日期
    airlineCode: '',                // 電代（僅機票）
    remarks: '',                    // 備註說明
    status: '進行中'                // 狀態
  });

  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);

  useEffect(() => {
    if (editingCase) {
      setFormData({
        category: editingCase.category || '',
        title: editingCase.title || '',
        client: editingCase.client || '',
        startDate: editingCase.startDate || '',
        endDate: editingCase.endDate || '',
        vendor: editingCase.vendor || '',
        bookingDate: editingCase.bookingDate || '',
        amount: editingCase.amount || '',
        hasCreditCardFee: editingCase.hasCreditCardFee || false,
        finalAmount: editingCase.finalAmount || '',
        paymentMethod: editingCase.paymentMethod || '未付款',
        paymentDate: editingCase.paymentDate || '',
        airlineCode: editingCase.airlineCode || '',
        remarks: editingCase.remarks || '',
        status: editingCase.status || '進行中'
      });
    } else {
      setFormData({
        category: '',
        title: '',
        client: '',
        startDate: '',
        endDate: '',
        vendor: '',
        bookingDate: '',
        amount: '',
        hasCreditCardFee: false,
        finalAmount: '',
        paymentMethod: '未付款',
        paymentDate: '',
        airlineCode: '',
        remarks: '',
        status: '進行中'
      });
    }
  }, [editingCase, isOpen]);

  // 計算最終金額（含信用卡手續費）
  useEffect(() => {
    if (formData.amount) {
      const baseAmount = parseFloat(formData.amount);
      if (!isNaN(baseAmount)) {
        if (formData.hasCreditCardFee) {
          const finalAmount = Math.round(baseAmount * 1.015); // 1.5% 手續費
          setFormData(prev => ({ ...prev, finalAmount: finalAmount.toString() }));
        } else {
          setFormData(prev => ({ ...prev, finalAmount: baseAmount.toString() }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, finalAmount: '' }));
    }
  }, [formData.amount, formData.hasCreditCardFee]);

  // 委託人自動完成邏輯
  const handleClientInput = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, client: value });
    
    if (value.length > 0) {
      const suggestions = CLIENTS.filter(client => 
        client.toLowerCase().includes(value.toLowerCase())
      );
      setClientSuggestions(suggestions);
      setShowClientSuggestions(true);
    } else {
      setShowClientSuggestions(false);
    }
  };

  const selectClient = (client) => {
    setFormData({ ...formData, client });
    setShowClientSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.title.trim()) {
      alert('請選擇案件分類並填寫案件標題');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // 統一的樣式
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151'
  };

  const fieldStyle = {
    marginBottom: '20px',
    width: '100%'
  };

  // 今天的日期（用於日期選擇器的最小值）
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        
        {/* 表單標題 */}
        <div style={{
          padding: '24px 32px 16px 32px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            margin: 0,
            color: '#111827'
          }}>
            {editingCase ? '✏️ 編輯案件' : '➕ 新增案件'}
          </h2>
        </div>

        {/* 表單內容 */}
        <div style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            
            {/* 1. 案件分類 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                案件分類 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
                required
              >
                <option value="">請選擇案件分類</option>
                {CASE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 2. 案件標題 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                案件標題 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="輸入案件標題"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* 3. 委託人 (自動完成) */}
            <div style={{ ...fieldStyle, position: 'relative' }}>
              <label style={labelStyle}>
                委託人
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={handleClientInput}
                onFocus={() => setShowClientSuggestions(true)}
                onBlur={() => setTimeout(() => setShowClientSuggestions(false), 200)}
                placeholder="輸入委託人姓名"
                style={inputStyle}
              />
              
              {/* 自動完成下拉選單 */}
              {showClientSuggestions && clientSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 10
                }}>
                  {clientSuggestions.map((client, index) => (
                    <div
                      key={index}
                      onClick={() => selectClient(client)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {client}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. 進行日期 (日期區間) */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                進行日期
              </label>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '12px', color: '#6b7280' }}>
                    開始日期
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={inputStyle}
                    min={today}
                  />
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  textAlign: 'center',
                  marginTop: '20px'
                }}>
                  至
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '12px', color: '#6b7280' }}>
                    結束日期
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={inputStyle}
                    min={formData.startDate || today}
                  />
                </div>
              </div>
            </div>

            {/* 5. 合作廠商 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                合作廠商
              </label>
              <select
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
              >
                <option value="">請選擇合作廠商</option>
                {VENDORS.map(vendor => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>
            </div>

            {/* 6. 開票/訂房時間 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                開票/訂房時間
              </label>
              <input
                type="date"
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* 7. 應收金額 (含信用卡手續費) */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                應收金額
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="輸入應收金額"
                  min="0"
                  style={inputStyle}
                />
                
                {/* 信用卡手續費選項 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <input
                    type="checkbox"
                    id="creditCardFee"
                    checked={formData.hasCreditCardFee}
                    onChange={(e) => setFormData({ ...formData, hasCreditCardFee: e.target.checked })}
                    style={{ marginRight: '4px' }}
                  />
                  <label htmlFor="creditCardFee" style={{ 
                    fontSize: '14px', 
                    color: '#374151',
                    cursor: 'pointer'
                  }}>
                    加收信用卡手續費 (1.5%)
                  </label>
                </div>

                {/* 最終金額顯示 */}
                {formData.finalAmount && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '6px',
                    border: '1px solid #16a34a'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#15803d',
                      fontWeight: '600'
                    }}>
                      最終金額: NT$ {parseInt(formData.finalAmount).toLocaleString()}
                      {formData.hasCreditCardFee && (
                        <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
                          {' '}(含手續費)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 8. 付款方式 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                付款方式
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* 9. 付款日期 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                付款日期
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* 10. 電代 (僅機票分類顯示) */}
            {formData.category === '機票' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  電代
                </label>
                <input
                  type="text"
                  value={formData.airlineCode}
                  onChange={(e) => setFormData({ ...formData, airlineCode: e.target.value })}
                  placeholder="輸入電代代碼 (例如: CI, BR, JX)"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            )}

            {/* 11. 備註說明 */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                備註說明
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="輸入備註說明"
                rows="3"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>

            {/* 操作按鈕 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                style={{ minWidth: '100px' }}
              >
                取消
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                style={{ minWidth: '120px' }}
              >
                {editingCase ? '更新案件' : '新增案件'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseForm;