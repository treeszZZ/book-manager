const STORAGE_KEY = 'bookManagerCategories';

export const getCategories = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addCategory = (name) => {
  const categories = getCategories();
  if (!categories.includes(name)) {
    categories.push(name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
};

export const removeCategory = (name) => {
  let categories = getCategories();
  categories = categories.filter(c => c !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

export const setCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};