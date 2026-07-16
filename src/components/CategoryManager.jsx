import React, { useState, useEffect } from 'react';
import { getAllBooks, updateBook } from '../db';
import { getCategories, addCategory, removeCategory } from '../utils/categoryStorage';

export default function CategoryManager({ categories, onClose, onCategoryChanged }) {
  const [newCategory, setNewCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const books = await getAllBooks();
      const countMap = {};
      
      // 统计每本书的分类
      books.forEach(book => {
        const cat = book.category || '默认';
        countMap[cat] = (countMap[cat] || 0) + 1;
      });
      
      // 从 localStorage 获取所有用户定义的分类（包括没有书籍的）
      const stored = getCategories();
      stored.forEach(cat => {
        if (!countMap[cat]) {
          countMap[cat] = 0;
        }
      });
      
      // 确保"默认"分类始终存在
      if (!countMap['默认']) {
        countMap['默认'] = 0;
        // 如果 localStorage 中没有"默认"，也添加进去
        const existing = getCategories();
        if (!existing.includes('默认')) {
          addCategory('默认');
        }
      }
      
      const list = Object.keys(countMap).map(name => ({
        name,
        count: countMap[name]
      }));
      
      // 排序：默认放在最后，其余按名称排序
      list.sort((a, b) => {
        if (a.name === '默认') return 1;
        if (b.name === '默认') return -1;
        return a.name.localeCompare(b.name);
      });
      
      setCategoryList(list);
    } catch (error) {
      console.error('加载分类失败:', error);
      alert('加载分类失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [categories]);

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      alert('请输入分类名称');
      return;
    }
    
    if (categoryList.some(c => c.name === trimmed)) {
      alert('该分类已存在');
      return;
    }
    
    // 存入 localStorage
    addCategory(trimmed);
    setNewCategory('');
    await loadCategories();
    
    // 通知父组件刷新
    if (onCategoryChanged) {
      onCategoryChanged();
    }
    
    alert(`分类 "${trimmed}" 已添加，你可以在导入或编辑书籍时选择它。`);
  };

  const handleDeleteCategory = async (categoryName) => {
    if (categoryName === '默认') {
      alert('默认分类不能删除');
      return;
    }
    
    const books = await getAllBooks();
    const count = books.filter(b => b.category === categoryName).length;
    
    if (count > 0) {
      const confirmDelete = window.confirm(
        `分类 "${categoryName}" 下有 ${count} 本书，删除后将自动改为"默认"分类，是否继续？`
      );
      if (!confirmDelete) return;
      
      // 批量更新这些书为"默认"
      for (const book of books) {
        if (book.category === categoryName) {
          await updateBook(book.id, { category: '默认' });
        }
      }
    }
    
    // 从 localStorage 移除
    removeCategory(categoryName);
    await loadCategories();
    
    if (onCategoryChanged) {
      onCategoryChanged();
    }
    
    alert(`分类 "${categoryName}" 已删除`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">📂 管理分类</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* 添加分类 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory();
              }}
              placeholder="输入新分类名称"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
            >
              添加
            </button>
          </div>

          {/* 分类列表 */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : (
            <div className="space-y-2">
              {categoryList.length === 0 ? (
                <div className="text-center py-8 text-gray-400">暂无分类，创建一个吧</div>
              ) : (
                categoryList.map(cat => (
                  <div 
                    key={cat.name} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{cat.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {cat.count} 本书
                      </span>
                    </div>
                    {cat.name !== '默认' && (
                      <button
                        onClick={() => handleDeleteCategory(cat.name)}
                        className="text-red-400 hover:text-red-600 text-sm hover:bg-red-50 px-2 py-1 rounded transition"
                      >
                        删除
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}