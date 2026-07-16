// 智能解析粘贴内容，支持多种格式
export const parseBooks = (text) => {
  const books = [];
  const lines = text.split(/[\n;；、，]/).filter(line => line.trim());

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const match = trimmed.match(/[《【]?([^》【】]*)[》】]?\s*([^，,，；;、]*)?[，,]?(.*)?/);
    
    if (match) {
      const [, title, author, notes] = match;
      if (title.trim()) {
        books.push({
          title: title.trim(),
          author: author?.trim() || '',
          notes: notes?.trim() || '',
          category: '默认',
          status: '想读',
          rating: 0,
        });
      }
    }
  });

  return books;
};

// 简化解析：按行解析（推荐使用这个）
export const parseBooksByLine = (text) => {
  const books = [];
  const lines = text.split('\n').filter(line => line.trim());

  lines.forEach(line => {
    const parts = line.split(/[，,]|、/);
    const title = parts[0]?.replace(/[《【]/g, '').replace(/[》】]/g, '').trim();
    const author = parts[1]?.trim() || '';
    const notes = parts.slice(2).join(',').trim();

    if (title) {
      books.push({
        title,
        author,
        notes,
        category: '默认',
        status: '想读',
        rating: 0,
      });
    }
  });

  return books;
};