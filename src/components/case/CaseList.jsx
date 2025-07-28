// src/components/case/CaseList.jsx
import React from 'react';
import CaseCard from './CaseCard';
import Card from '../ui/Card';

const EmptyState = ({ searchTerm, hasFilters, onReset }) => (
  <Card padding="large">
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6b7280'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
        {searchTerm || hasFilters ? '🔍' : '📋'}
      </div>
      
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px'
      }}>
        {searchTerm || hasFilters ? '沒有找到符合條件的案件' : '還沒有任何案件'}
      </h3>
      
      <p style={{
        fontSize: '14px',
        marginBottom: '16px'
      }}>
        {searchTerm || hasFilters 
          ? '試試調整搜尋關鍵字或篩選條件' 
          : '點擊上方的「新增案件」按鈕來建立第一個案件'
        }
      </p>

      {(searchTerm || hasFilters) && onReset && (
        <button
          onClick={onReset}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          🔄 清除篩選條件
        </button>
      )}
    </div>
  </Card>
);

const CaseList = ({ 
  cases, 
  onEdit, 
  onDelete, 
  searchTerm, 
  hasFilters, 
  onResetFilters,
  loading = false 
}) => {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {[1, 2, 3].map(i => (
          <Card key={i} padding="large">
            <div style={{
              height: '120px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite',
              borderRadius: '4px'
            }} />
          </Card>
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <EmptyState 
        searchTerm={searchTerm}
        hasFilters={hasFilters}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px',
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
          {cases.length} 個案件
        </span>
      </h2>

      <div style={{
        display: 'grid',
        gap: '16px'
      }}>
        {cases.map((case_) => (
          <CaseCard
            key={case_.id}
            case_={case_}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 載入更多按鈕（預留給分頁功能） */}
      {cases.length > 0 && cases.length % 10 === 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <button
            style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
          >
            📄 載入更多案件...
          </button>
        </div>
      )}
    </div>
  );
};

// 添加載入動畫的 CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(style);

export default CaseList;