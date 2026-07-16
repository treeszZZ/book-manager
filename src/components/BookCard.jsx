import React from 'react';

export default function BookCard({ book, onEdit, onDelete, viewMode = 'grid' }) {
  const statusColors = {
    '想读': 'bg-[#d8efdd] text-[#33593b]',
    '在读': 'bg-[#b8ddc2] text-[#33593b]',
    '已读': 'bg-[#a8cdb2] text-[#33593b]',
  };

  // 列表模式
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onEdit(book)}
        className="card-spring p-4 flex items-center gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-normal text-text-primary">{book.title}</h3>
            <span className={`px-3 py-0.5 rounded-full text-xs font-light ${statusColors[book.status]}`}>
              {book.status}
            </span>
            {book.rating > 0 && (
              <span className="text-sm text-yellow-600">{'⭐'.repeat(book.rating)}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary mt-1 flex-wrap">
            <span>{book.author || '未知作者'}</span>
            {book.category && <span>🏷️ {book.category}</span>}
            {book.notes && <span className="italic line-clamp-1">"{book.notes}"</span>}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(book.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 rounded transition"
        >
          🗑️
        </button>
      </div>
    );
  }

  // 网格模式
  return (
    <div
      onClick={() => onEdit(book)}
      className="card-spring p-5 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-normal text-text-primary text-lg">{book.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(book.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 rounded transition"
        >
          🗑️
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-3">{book.author || '未知作者'}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-light ${statusColors[book.status]}`}>
          {book.status}
        </span>
        {book.rating > 0 && (
          <span className="text-sm text-yellow-600">{'⭐'.repeat(book.rating)}</span>
        )}
      </div>

      {book.category && (
        <p className="text-xs text-text-secondary mb-2">🏷️ {book.category}</p>
      )}

      {book.notes && (
        <p className="text-sm text-text-secondary line-clamp-2 italic">"{book.notes}"</p>
      )}
    </div>
  );
}