import React, { useState, useEffect } from 'react';
import { getAllBooks, getStats, addBook, updateBook, deleteBook } from './db';
import { parseBooksByLine } from './utils/parser';
import ImportModal from './components/ImportModal';
import EditModal from './components/EditModal';
import BookCard from './components/BookCard';
import StatCard from './components/StatCard';
import CategoryManager from './components/CategoryManager';

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ totalCount: 0, readCount: 0, categoryCount: 0, categories: [] });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [parseResults, setParseResults] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const allBooks = await getAllBooks();
    setBooks(allBooks);
    const statsData = await getStats();
    setStats(statsData);
  };

  const filteredBooks = books.filter(book => {
    const categoryMatch = !selectedCategory || book.category === selectedCategory;
    const searchMatch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleImport = (text) => {
    const parsed = parseBooksByLine(text);
    setParseResults(parsed);
  };

  const handleConfirmImport = async (booksToAdd) => {
    for (const book of booksToAdd) {
      await addBook(book);
    }
    await loadBooks();
    setShowImportModal(false);
    setParseResults([]);
  };

  const handleSaveBook = async (updatedBook) => {
    if (editingBook?.id) {
      const { id, ...updates } = updatedBook;
      await updateBook(id, updates);
    } else {
      await addBook(updatedBook);
    }
    await loadBooks();
    setShowEditModal(false);
    setEditingBook(null);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('确认删除这本书吗？')) {
      await deleteBook(id);
      await loadBooks();
    }
  };

  const ViewToggle = () => (
    <div className="flex gap-1 bg-[#d8efdd]/40 p-1 rounded-full">
      <button
        onClick={() => setViewMode('grid')}
        className={`px-3 py-1 rounded-full text-sm transition ${
          viewMode === 'grid' 
            ? 'bg-white text-[#33593b] shadow-soft' 
            : 'text-[#778c7c] hover:text-[#33593b]'
        }`}
      >
        📐 网格
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1 rounded-full text-sm transition ${
          viewMode === 'list' 
            ? 'bg-white text-[#33593b] shadow-soft' 
            : 'text-[#778c7c] hover:text-[#33593b]'
        }`}
      >
        📋 列表
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg-milk text-text-primary">
      {/* ====== 左侧固定侧边栏 ====== */}
      <aside className="w-[220px] flex-shrink-0 h-screen sticky top-0 bg-white/70 backdrop-blur-md border-r border-[#b8ddc2]/30 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-normal tracking-wide flex items-center gap-2 text-text-primary">
            <span className="text-2xl">🌿</span> 书单森林
          </h1>
          <p className="text-xs text-text-secondary mt-1">收藏你的阅读足迹</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-4 py-2 rounded-xl text-sm transition ${
              !selectedCategory 
                ? 'bg-[#d8efdd] text-text-primary' 
                : 'text-text-secondary hover:bg-[#d8efdd]/40'
            }`}
          >
            📚 全部书籍
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="w-full text-left px-4 py-2 rounded-xl text-sm text-text-secondary hover:bg-[#d8efdd]/40 transition"
          >
            ✨ 智能导入
          </button>
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="w-full text-left px-4 py-2 rounded-xl text-sm text-text-secondary hover:bg-[#d8efdd]/40 transition"
          >
            📂 管理分类
          </button>
          {/* 可扩展更多菜单 */}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#b8ddc2]/30 text-xs text-text-secondary flex items-center gap-1">
          <span>🍀</span> 春日阅读
        </div>
      </aside>

      {/* ====== 右侧主内容 ====== */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* 通栏大图 Banner（仿照设计，可以放装饰文字） */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#d8efdd] to-[#b8ddc2] p-6 mb-8 shadow-soft">
          <div className="relative z-10">
            <h2 className="text-2xl font-light text-text-primary tracking-wide">
              📖 今日阅读
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {books.length} 本书陪伴着你
            </p>
          </div>
          <div className="absolute right-4 top-0 text-7xl opacity-20 select-none">🌱</div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="总本数" value={stats.totalCount} icon="📚" />
          <StatCard label="已读本数" value={stats.readCount} icon="✅" />
          <StatCard label="分类数量" value={stats.categoryCount} icon="🏷️" />
        </div>

        {/* 搜索 + 筛选 + 视图切换 */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <ViewToggle />
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索书名或作者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] text-text-primary placeholder-text-secondary/60 text-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] text-text-primary text-sm"
          >
            <option value="">全部分类</option>
            {stats.categories?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 书籍列表 */}
        {filteredBooks.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'flex flex-col gap-3'
          }>
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(b) => {
                  setEditingBook(b);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteBook}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-lg">暂无书籍，来导入你的第一本吧 📭</p>
          </div>
        )}
      </main>

      {/* 模态框 */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
          parseResults={parseResults}
          onConfirm={handleConfirmImport}
          categories={stats.categories}
        />
      )}
      {showEditModal && (
        <EditModal
          book={editingBook}
          categories={stats.categories}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveBook}
        />
      )}
      {showCategoryModal && (
        <CategoryManager
          categories={stats.categories}
          onClose={() => setShowCategoryModal(false)}
          onCategoryChanged={loadBooks}
        />
      )}
    </div>
  );
}