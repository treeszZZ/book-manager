import React, { useState } from 'react';

export default function EditModal({ book, categories, onClose, onSave }) {
  const [formData, setFormData] = useState(book || {
    title: '',
    author: '',
    category: '默认',
    status: '想读',
    rating: 0,
    notes: '',
  });

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-soft max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#b8ddc2]/30">
        <div className="px-6 py-4 border-b border-[#b8ddc2]/20 flex items-center justify-between">
          <h2 className="text-xl font-light text-text-primary">
            {book?.id ? '✏️ 编辑书籍' : '➕ 新增书籍'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-text-primary mb-1">书名 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-full border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] text-text-primary text-sm"
              placeholder="输入书名"
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">作者</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-4 py-2 rounded-full border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] text-text-primary text-sm"
              placeholder="输入作者"
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 rounded-full border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] text-text-primary text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-2">阅读状态</label>
            <div className="flex gap-2">
              {['想读', '在读', '已读'].map(status => (
                <button
                  key={status}
                  onClick={() => setFormData({...formData, status})}
                  className={`flex-1 py-2 rounded-full text-sm font-light transition ${
                    formData.status === status
                      ? 'bg-[#b8ddc2] text-text-primary'
                      : 'bg-[#d8efdd]/30 text-text-secondary hover:bg-[#d8efdd]/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-2">评分</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFormData({...formData, rating})}
                  className={`text-2xl transition ${
                    rating <= formData.rating ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">感想</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="写下你的读书感想..."
              className="w-full px-4 py-2 rounded-xl border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] resize-none h-20 text-text-primary text-sm placeholder-text-secondary/60"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#b8ddc2]/20 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-text-secondary hover:bg-[#d8efdd]/40 rounded-full transition text-sm">
            取消
          </button>
          <button onClick={() => onSave(formData)} className="px-5 py-2 bg-[#b8ddc2] text-text-primary rounded-full hover:bg-[#a8cdb2] transition text-sm">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}