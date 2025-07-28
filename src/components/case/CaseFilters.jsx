// src/components/case/CaseFilters.jsx
import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CASE_STATUSES, CASE_CATEGORIES } from '../../utils/constants';

const CaseFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  hasActiveFilters,
  resetFilters,
  resultCount
}) => {
  return (
    <Card padding="normal">
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px'
      }}>
        🔍 搜尋與篩選
      </h3>

      {/* 搜尋區域 */}
      <div style={{ marginBottom: '16px' }}>
        <Input
          type="text"
          placeholder="搜尋案件標題、內容、廠商、標籤..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<span>🔍</span>}
        />
      </div>

      {/* 篩選區域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '4px',
            color: '#6b7280'
          }}>
            狀態篩選
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none'
            }}
          >
            <option value="全部">全部狀態</option>
            {CASE_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '4px',
            color: '#6b7280'
          }}>
            分類篩選
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none'
            }}
          >
            <option value="全部">全部分類</option>
            {CASE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 結果和重置 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          {searchTerm || hasActiveFilters ? (
            <>🔍 找到 <strong>{resultCount}</strong> 個案件</>
          ) : (
            <>📊 共 <strong>{resultCount}</strong> 個案件</>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="small"
            onClick={resetFilters}
          >
            🔄 重置篩選
          </Button>
        )}
      </div>

      {/* 快速篩選標籤 */}
      {!hasActiveFilters && (
        <div style={{ marginTop: '12px' }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '6px'
          }}>
            快速篩選:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CASE_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CaseFilters;