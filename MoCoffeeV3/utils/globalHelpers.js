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

export const convertPriceStringToInteger = priceString => {
  // Loại bỏ ký tự '₫' từ chuỗi giá tiền
  const cleanedPriceString = priceString.replace('₫', '');
  // Loại bỏ tất cả các dấu ',' từ chuỗi giá tiền
  const priceWithoutCommas = cleanedPriceString.replace(/,/g, '');
  // Chuyển đổi chuỗi giá tiền thành số nguyên
  const priceInteger = parseInt(priceWithoutCommas);
  return priceInteger;
};

export const convertIntegerToPriceString = priceInteger => {
  // Sử dụng phương thức toLocaleString để thêm dấu ',' phân cách hàng nghìn và định dạng số
  const formattedPrice = priceInteger.toLocaleString('en-US');
  // Thêm ký tự '₫' vào cuối chuỗi giá tiền
  const priceString = formattedPrice + '₫';
  return priceString;
};
