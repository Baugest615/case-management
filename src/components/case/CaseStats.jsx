// src/components/case/CaseStats.jsx
import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ title, value, color, bgColor, icon }) => (
  <Card padding="normal" hover>
    <div style={{
      textAlign: 'center',
      backgroundColor: bgColor,
      borderRadius: '8px',
      padding: '20px',
      border: `1px solid ${color}20`
    }}>
      {icon && (
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
          {icon}
        </div>
      )}
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: color,
        marginBottom: '4px'
      }}>
        {typeof value === 'number' && value > 9999 
          ? `NT$ ${value.toLocaleString()}` 
          : value
        }
      </div>
      <div style={{
        fontSize: '14px',
        color: '#6b7280'
      }}>
        {title}
      </div>
    </div>
  </Card>
);

const CaseStats = ({ stats }) => {
  const statItems = [
    {
      title: '總案件數',
      value: stats.total,
      color: '#1d4ed8',
      bgColor: '#eff6ff',
      icon: '📊'
    },
    {
      title: '已完成',
      value: stats.completed,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      icon: '✅'
    },
    {
      title: '進行中',
      value: stats.inProgress,
      color: '#d97706',
      bgColor: '#fef3c7',
      icon: '🔄'
    },
    {
      title: '待確認',
      value: stats.pending,
      color: '#dc2626',
      bgColor: '#fef2f2',
      icon: '⏳'
    },
    {
      title: '總金額',
      value: stats.totalAmount,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      icon: '💰'
    }
  ];

  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px'
      }}>
        📈 統計概覽
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {statItems.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default CaseStats;