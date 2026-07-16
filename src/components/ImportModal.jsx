import React, { useState } from 'react';

export default function ImportModal({ onClose, onImport, parseResults, onConfirm, categories }) {
  const [inputText, setInputText] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [step, setStep] = useState('input');
  const [selectedCategory, setSelectedCategory] = useState('默认');

  const handleParse = () => {
    onImport(inputText);
    setStep('preview');
  };

  const toggleBook = (index) => {
    setSelectedBooks(prev => {
      const exists = prev.find(b => b.title === parseResults[index].title);
      if (exists) {
        return prev.filter(b => b.title !== parseResults[index].title);
      } else {
        return [...prev, parseResults[index]];
      }
    });
  };

  const handleConfirm = () => {
    const booksToAdd = selectedBooks.map(book => ({
      ...book,
      category: selectedCategory,
    }));
    onConfirm(booksToAdd);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#b8ddc2]/30">
        <div className="px-6 py-4 border-b border-[#b8ddc2]/20 flex items-center justify-between">
          <h2 className="text-xl font-light text-text-primary">
            {step === 'input' ? '📋 智能导入' : '✨ 解析结果'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 'input' ? (
            <div>
              <p className="text-sm text-text-secondary mb-3">
                💡 用逗号、顿号或换行分隔每本书
              </p>
              <div className="mb-3 flex items-center gap-2">
                <label className="text-sm text-text-primary">导入分类：</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 rounded-full border border-[#b8ddc2]/40 bg-white/60 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="每行一本书，用逗号或顿号分隔书名、作者、感想"
                className="w-full h-48 p-4 rounded-xl border border-[#b8ddc2]/40 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b8ddc2] resize-none text-text-primary placeholder-text-secondary/60"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-text-secondary">
                  找到 <span className="font-medium text-text-primary">{parseResults.length}</span> 本书
                </p>
                <p className="text-sm text-text-secondary">
                  分类：<span className="font-medium text-text-primary">{selectedCategory}</span>
                </p>
              </div>
              {parseResults.map((book, index) => (
                <label key={index} className="flex items-center p-3 rounded-xl border border-[#b8ddc2]/20 hover:bg-[#d8efdd]/30 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedBooks.some(b => b.title === book.title)}
                    onChange={() => toggleBook(index)}
                    className="w-4 h-4 text-[#b8ddc2] rounded focus:ring-[#b8ddc2]"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-normal text-text-primary">{book.title}</p>
                    <p className="text-sm text-text-secondary">
                      {book.author && `作者：${book.author}`}
                      {book.notes && ` | ${book.notes}`}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#b8ddc2]/20 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-text-secondary hover:bg-[#d8efdd]/40 rounded-full transition text-sm">
            取消
          </button>
          {step === 'input' ? (
            <button
              onClick={handleParse}
              disabled={!inputText.trim()}
              className="px-5 py-2 bg-[#b8ddc2] text-text-primary rounded-full hover:bg-[#a8cdb2] disabled:opacity-50 transition text-sm"
            >
              解析
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={selectedBooks.length === 0}
              className="px-5 py-2 bg-[#b8ddc2] text-text-primary rounded-full hover:bg-[#a8cdb2] disabled:opacity-50 transition text-sm"
            >
              导入 {selectedBooks.length > 0 ? `(${selectedBooks.length})` : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}