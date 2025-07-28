'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Calendar, User, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CaseManagementSystem() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const [newCase, setNewCase] = useState({
    title: '',
    content: '',
    category: '',
    status: '進行中',
    amount: '',
    payment_method: '',
    vendor: '',
    tags: []
  });

  // 預設選項
  const suggestions = {
    vendors: ['KGI', 'EXPEDIA', '台中場台足球俱樂部', 'TRIP', 'SHAIJK'],
    paymentMethods: ['台新-線上刷卡', '現金', 'EXPEDIA 訂房(AE卡)', 'TRIP 1/3付款'],
    categories: ['差旅', '住宿', '場地', '餐飲', '交通', '會議'],
    tags: ['機票', '住宿', '會議', '出差', '台中', '香港', '商務', '場地租借']
  };

  // 載入資料
  useEffect(() => {
    fetchCases();
  }, []);

  // 搜尋和篩選
  useEffect(() => {
    let filtered = cases;
    
    if (searchTerm) {
      filtered = filtered.filter(case_ =>
        case_.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(case_ => case_.status === filterStatus);
    }

    setFilteredCases(filtered);
  }, [searchTerm, filterStatus, cases]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('載入資料錯誤:', error);
      alert('載入資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCase = async () => {
    if (!newCase.title || !newCase.content) {
      alert('請填寫標題和內容');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([{
          title: newCase.title,
          content: newCase.content,
          category: newCase.category,
          status: newCase.status,
          amount: parseInt(newCase.amount) || null,
          payment_method: newCase.payment_method,
          vendor: newCase.vendor,
          tags: newCase.tags
        }])
        .select();

      if (error) throw error;
      
      setCases([data[0], ...cases]);
      resetForm();
      alert('新增成功！');
    } catch (error) {
      console.error('新增錯誤:', error);
      alert('新增失敗');
    }
  };

  const handleUpdateCase = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .update({
          title: newCase.title,
          content: newCase.content,
          category: newCase.category,
          status: newCase.status,
          amount: parseInt(newCase.amount) || null,
          payment_method: newCase.payment_method,
          vendor: newCase.vendor,
          tags: newCase.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCase.id)
        .select();

      if (error) throw error;

      setCases(cases.map(c => c.id === editingCase.id ? data[0] : c));
      resetForm();
      alert('更新成功！');
    } catch (error) {
      console.error('更新錯誤:', error);
      alert('更新失敗');
    }
  };

  const resetForm = () => {
    setNewCase({
      title: '',
      content: '',
      category: '',
      status: '進行中',
      amount: '',
      payment_method: '',
      vendor: '',
      tags: []
    });
    setShowAddForm(false);
    setEditingCase(null);
  };

  const handleEditCase = (case_) => {
    setEditingCase(case_);
    setNewCase({
      title: case_.title || '',
      content: case_.content || '',
      category: case_.category || '',
      status: case_.status || '進行中',
      amount: case_.amount || '',
      payment_method: case_.payment_method || '',
      vendor: case_.vendor || '',
      tags: case_.tags || []
    });
    setShowAddForm(true);
  };

  const addTag = (tag) => {
    if (tag && !newCase.tags.includes(tag)) {
      setNewCase({ ...newCase, tags: [...newCase.tags, tag] });
    }
  };

  const removeTag = (tagToRemove) => {
    setNewCase({ ...newCase, tags: newCase.tags.filter(tag => tag !== tagToRemove) });
  };

  const SmartInput = ({ suggestions: fieldSuggestions, value, onChange, placeholder }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
      if (value && fieldSuggestions) {
        const filtered = fieldSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      }
    }, [value, fieldSuggestions]);

    return (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">案件管理系統</h1>
        
        {/* 搜尋和篩選區 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋案件標題、內容、廠商或標籤..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有狀態</option>
              <option value="進行中">進行中</option>
              <option value="已完成">已完成</option>
              <option value="待確認">待確認</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新增案件
            </button>
          </div>
        </div>

        {/* 案件列表 */}
        <div className="grid gap-4">
          {filteredCases.map((case_) => (
            <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                  <p className="text-gray-600 mt-1">{case_.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    case_.status === '已完成' ? 'bg-green-100 text-green-800' :
                    case_.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {case_.status}
                  </span>
                  <button
                    onClick={() => handleEditCase(case_)}
                    className="p-2 text-gray-500 hover:text-blue-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span>{case_.category || '未分類'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{case_.vendor || '未指定'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(case_.created_at).toLocaleDateString('zh-TW')}</span>
                </div>
              </div>
              
              {case_.amount && (
                <div className="mt-2 text-lg font-semibold text-green-600">
                  NT$ {case_.amount.toLocaleString()}
                </div>
              )}
              
              {case_.payment_method && (
                <div className="mt-1 text-sm text-gray-600">
                  付款方式: {case_.payment_method}
                </div>
              )}
              
              {case_.tags && case_.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {case_.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">目前沒有符合條件的案件</p>
          </div>
        )}
      </div>

      {/* 新增/編輯表單 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCase ? '編輯案件' : '新增案件'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">案件標題 *</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="輸入案件標題"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">案件內容 *</label>
                <textarea
                  value={newCase.content}
                  onChange={(e) => setNewCase({ ...newCase, content: e.target.value })}
                  placeholder="輸入案件詳細內容"
                  rows="3"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">分類</label>
                  <SmartInput
                    suggestions={suggestions.categories}
                    value={newCase.category}
                    onChange={(value) => setNewCase({ ...newCase, category: value })}
                    placeholder="選擇或輸入分類"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">狀態</label>
                  <select
                    value={newCase.status}
                    onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="進行中">進行中</option>
                    <option value="已完成">已完成</option>
                    <option value="待確認">待確認</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">廠商</label>
                  <SmartInput
                    suggestions={suggestions.vendors}
                    value={newCase.vendor}
                    onChange={(value) => setNewCase({ ...newCase, vendor: value })}
                    placeholder="選擇或輸入廠商"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">金額</label>
                  <input
                    type="number"
                    value={newCase.amount}
                    onChange={(e) => setNewCase({ ...newCase, amount: e.target.value })}
                    placeholder="輸入金額"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">付款方式</label>
                <SmartInput
                  suggestions={suggestions.paymentMethods}
                  value={newCase.payment_method}
                  onChange={(value) => setNewCase({ ...newCase, payment_method: value })}
                  placeholder="選擇或輸入付款方式"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">標籤</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newCase.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.tags.map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                      disabled={newCase.tags.includes(tag)}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={editingCase ? handleUpdateCase : handleAddCase}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingCase ? '更新' : '新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}