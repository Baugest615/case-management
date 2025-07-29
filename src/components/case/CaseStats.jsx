// src/components/case/CaseStats.jsx - 更新版本
import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ title, value, color, bgColor, icon, subtitle }) => (
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
        color: '#6b7280',
        fontWeight: '500'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '4px'
        }}>
          {subtitle}
        </div>
      )}
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
      icon: '📊',
      subtitle: '全部案件'
    },
    {
      title: '已完成',
      value: stats.completed,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      icon: '✅',
      subtitle: '完成案件'
    },
    {
      title: '進行中',
      value: stats.inProgress,
      color: '#d97706',
      bgColor: '#fef3c7',
      icon: '🔄',
      subtitle: '進行中案件'
    },
    {
      title: '待確認',
      value: stats.pending,
      color: '#dc2626',
      bgColor: '#fef2f2',
      icon: '⏳',
      subtitle: '等待確認'
    },
    {
      title: '總金額',
      value: stats.totalAmount,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      icon: '💰',
      subtitle: '所有案件金額'
    },
    {
      title: '已收款',
      value: stats.paidAmount,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      icon: '💳',
      subtitle: '已完成付款'
    },
    {
      title: '未收款',
      value: stats.unpaidAmount,
      color: '#ea580c',
      bgColor: '#fef2f2',
      icon: '⏰',
      subtitle: '待收款項'
    }
  ];

  // 計算付款比例
  const paymentRate = stats.totalAmount > 0 ? 
    ((stats.paidAmount / stats.totalAmount) * 100).toFixed(1) : 0;

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
        📈 統計概覽
        {stats.totalAmount > 0 && (
          <span style={{
            fontSize: '12px',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: 'normal'
          }}>
            付款率: {paymentRate}%
          </span>
        )}
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

      {/* 付款狀態摘要 */}
      {stats.totalAmount > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Card padding="normal">
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px'
            }}>
              💼 付款狀態摘要
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #16a34a20'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '600' }}>
                      已收款比例
                    </div>
                    <div style={{ fontSize: '18px', color: '#16a34a', fontWeight: 'bold' }}>
                      {paymentRate}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #dc262620'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>⏰</span>
                  <div>
                    <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
                      待收款比例
                    </div>
                    <div style={{ fontSize: '18px', color: '#ea580c', fontWeight: 'bold' }}>
                      {(100 - paymentRate).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📊</span>
                  <div>
                    <div style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      平均案件金額
                    </div>
                    <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>
                      NT$ {stats.total > 0 ? Math.round(stats.totalAmount / stats.total).toLocaleString() : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CaseStats;