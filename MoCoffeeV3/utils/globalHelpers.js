// helpersGlobal.js

export const translateCategory = category => {
  const translations = {
    tea: 'Trà',
    coffee: 'Cà phê',
    'coffee-espresso': 'Cà phê pha máy (Espresso)',
    'milk-tea': 'Trà sữa',
    yogurt: 'Sữa chua',
    soda: 'Soda',
    smoothie: 'Sinh tố',
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

export const generateKeyID = (value, orderNumber) => {
  // Lấy mã category từ value
  let categoryCode = '';
  switch (value.toLowerCase()) {
    case 'tea':
      categoryCode = 'TEA';
      break;
    case 'coffee':
      categoryCode = 'COF';
      break;
    case 'milk-tea':
      categoryCode = 'MILK';
      break;
    default:
      categoryCode = 'OTH'; // Nếu không khớp với các giá trị trên, gán một mã khác
  }

  // Lấy ngày hiện tại
  const currentDate = new Date();
  const datePart = `${currentDate.getDate()}${currentDate.getMonth() + 1}${
    currentDate.getFullYear() % 100
  }`;

  // Tăng số đơn hàng lên 1 nếu orderNumber là một chuỗi hoặc một số
  if (typeof orderNumber === 'string' || typeof orderNumber === 'number') {
    orderNumber = parseInt(orderNumber) + 1;
  } else {
    orderNumber = 1; // Nếu không, gán giá trị mặc định là 1
  }

  // Tạo mã đơn hàng có độ dài là 3 ký tự bằng cách thêm các số 0 vào đầu
  const orderNumberString = orderNumber.toString().padStart(3, '0');

  // Tạo KEY ID từ mã category, ngày và số đơn hàng
  const keyID = `${categoryCode}${datePart}${orderNumberString}`;

  return keyID;
};

// Chuyển thời gian ISO => hh:mm:ss, dd/mm/yyyy
/**
 * Cách dùng
 * const timeNow = new Date().toISOString();
 * const createdAt = convertISOToFormattedDate(timeNow);
 */
export const convertISOToFormattedDate = isoDateString => {
  const date = new Date(isoDateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
};

export const convertFormattedDateToISO = formattedDateString => {
  const [timePart, datePart] = formattedDateString.split(', ');
  const [hours, minutes, seconds] = timePart.split(':');
  const [day, month, year] = datePart.split('/');

  const unixTime =
    new Date(
      `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
    ).getTime() / 1000;

  return unixTime;
};

export const convertFormattedDateToUnixTime = formattedDateString => {
  const [timePart, datePart] = formattedDateString.split(', ');
  const [hours, minutes, seconds] = timePart.split(':');
  const [day, month, year] = datePart.split('/');

  // Tạo một đối tượng Date từ các phần của chuỗi đã cung cấp
  const dateObject = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
  );

  // Chuyển đổi sang thời gian Unix (đơn vị là milliseconds)
  const unixTime = dateObject.getTime() / 1000; // Chia cho 1000 để chuyển đổi sang giây

  return unixTime;
};

export const translateStatusOrders = status => {
  const translations = {
    wait4pay: 'Đang chờ thanh toán', // áp dụng khi thanh toán online //warning => yellow
    pending: 'Đang chờ duyệt', // info => blue
    processing: 'Đang được xử lý', // approved: đơn được duyệt sẽ chuyển qua trạng thái này info => blue
    shipping: 'Đang giao hàng', // đang được chuyển đến khách hàng => green
    shipped: 'Đã giao hàng thành công', // khi đơn đã được giao đến khách hàng thành công => blue
    cancelled: 'Đã hủy đơn hàng', // khi đơn hàng bị hủy => red
  };
  // Nếu có, trả về giá trị tương ứng
  // Nếu không, trả về status ban đầu
  return translations[status] || status;
};

export const translatePaymentMethod = method => {
  const translations = {
    cash: 'Tiền mặt',
    credit: 'Thẻ tín dụng',
    momowallet: 'Ví Momo',
    zalopaywallet: 'Ví ZaloPay',
  };
  return translations[method] || method;
};

export const processPayment = payment =>
  payment === 'cash' ? 'pending' : 'wait4pay';

export const convertStatusToMessage = status => {
  switch (status) {
    case 'wait4pay':
    case 'pending':
      return 'Duyệt đơn';
    case 'processing':
      return 'Giao hàng';
    case 'shipping':
      return 'Đã giao hàng';
    default:
      return 'Không hợp lệ';
  }
};

export const getOrderStatusBackgroundColor = status => {
  switch (status) {
    case 'wait4pay':
      return '#e5b700';
    case 'pending':
      return '#737373'; //gray
    case 'processing':
      return '#4c4cff'; //blue
    case 'shipped':
    case 'shipping':
      return '#4ca64c'; //xanh lá cây
    case 'cancelled':
      return '#ff4c4c'; //red
    default:
      return '#000';
  }
};

export const isShippedOrCancelled = status => {
  return !(status === 'shipped' || status === 'cancelled');
};
