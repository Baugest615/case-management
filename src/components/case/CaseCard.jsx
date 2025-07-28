// src/components/case/CaseCard.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { STATUS_COLORS } from '../../utils/constants';

const CaseCard = ({ case_, onEdit, onDelete }) => {
  const statusColor = STATUS_COLORS[case_.status] || STATUS_COLORS['進行中'];

  const handleDelete = () => {
    if (window.confirm('確定要刪除這個案件嗎？')) {
      onDelete(case_.id);
    }
  };

  return (
    <Card hover padding="large">
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
          onClick={() => onEdit(case_)}
        >
          ✏️ 編輯
        </Button>
        
        <Button
          variant="danger"
          size="small"
          onClick={handleDelete}
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
};

export default CaseCard;