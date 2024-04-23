// helpersGlobal.js

export const translateCategory = category => {
  const translations = {
    tea: 'Trà',
    coffee: 'Cà phê',
    'milk-tea': 'Trà sữa',
  };
  // Nếu có, trả về giá trị tương ứng
  // Nếu không, trả về category ban đầu
  return translations[category] || category;
};
