import Dexie from 'dexie';
import { getCategories } from './utils/categoryStorage';

export const db = new Dexie('BookManager');

db.version(1).stores({
  books: '++id, category, status, createdTime'
});

export const addBook = async (book) => {
  const now = new Date().toISOString();
  return await db.books.add({
    ...book,
    createdTime: book.createdTime || now,
    updatedTime: now,
    rating: book.rating || 0,
  });
};

export const updateBook = async (id, updates) => {
  return await db.books.update(id, {
    ...updates,
    updatedTime: new Date().toISOString(),
  });
};

export const deleteBook = async (id) => {
  return await db.books.delete(id);
};

export const getAllBooks = async () => {
  return await db.books.toArray();
};

export const getStats = async () => {
  const books = await getAllBooks();
  const totalCount = books.length;
  const readCount = books.filter(b => b.status === '已读').length;
  
  const bookCategorySet = new Set(books.map(b => b.category).filter(Boolean));
  // 从 localStorage 获取所有用户定义的分类
  const storedCategories = getCategories();
  storedCategories.forEach(c => bookCategorySet.add(c));
  // 确保“默认”存在
  bookCategorySet.add('默认');
  
  const categoryArray = Array.from(bookCategorySet);
  return {
    totalCount,
    readCount,
    categoryCount: categoryArray.length,
    categories: categoryArray,
  };
};
