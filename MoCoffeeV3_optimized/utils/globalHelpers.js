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

export const translateRole = role => {
  const translations = {
    user: 'Người dùng',
    admin: 'Quản trị viên',
    staff: 'Nhân viên',
  };
  return translations[role] || role;
};

export const convertPriceStringToInteger = priceString => {
  if (priceString !== undefined) {
    // console.log('priceString: ', priceString);
    // Loại bỏ ký tự '₫' từ chuỗi giá tiền
    const cleanedPriceString = priceString.replace('₫', '');
    // Loại bỏ tất cả các dấu ',' từ chuỗi giá tiền
    const priceWithoutCommas = cleanedPriceString.replace(/,/g, '');
    // Chuyển đổi chuỗi giá tiền thành số nguyên
    const priceInteger = parseInt(priceWithoutCommas, 10);
    return priceInteger;
  } else {
    // Xử lý trường hợp priceString là undefined (có thể trả về null hoặc 0 tuỳ theo yêu cầu của bạn)
    return null;
  }
};

export const convertIntegerToPriceString = priceInteger => {
  // Sử dụng phương thức toLocaleString để thêm dấu ',' phân cách hàng nghìn và định dạng số
  const formattedPrice = priceInteger.toLocaleString('en-US');
  // Thêm ký tự '₫' vào cuối chuỗi giá tiền
  const priceString = formattedPrice + '₫';
  return priceString;
};

export const convertStringToNumber = (inputString = '0', numberToAdd = 0) => {
  // Chuyển đổi chuỗi thành số
  const number = parseInt(inputString);

  // Kiểm tra nếu number là NaN (không phải số)
  if (isNaN(number && numberToAdd)) {
    return 'Không phải số';
  }

  // Thêm số vào kết quả
  return number + numberToAdd;
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
    shipped: 'Giao hàng thành công', // khi đơn đã được giao đến khách hàng thành công => blue
    cancelled: 'Đã hủy đơn hàng', // khi đơn hàng bị hủy => red
  };
  // Nếu có, trả về giá trị tương ứng
  // Nếu không, trả về status ban đầu
  return translations[status] || status;
};

export const translateStatusDetailOrders = status => {
  const statusInfo = {
    wait4pay: {
      message: 'Đơn hàng đang chờ thanh toán',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/8704/8704866.png', // Thay thế bằng đường dẫn icon thực tế
    },
    pending: {
      message: 'Đơn hàng đang chờ duyệt',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/831/831110.png',
    },
    processing: {
      message: 'Đơn hàng đang được xử lý',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/9431/9431379.png',
    },
    shipping: {
      message: 'Đơn hàng đang được giao',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/411/411712.png',
    },
    shipped: {
      message: 'Đơn hàng đã giao thành công',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/12964/12964027.png',
    },
    cancelled: {
      message: 'Đơn hàng đã hủy',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/338/338056.png',
    },
  };

  return (
    statusInfo[status] || {
      message: 'Trạng thái không xác định',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/6146/6146689.png',
    }
  );
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
      // return '#4c4cff'; //blue
      return '#5d5dff'; //blue (nhạt hơn)
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

export const isCancelled = status => {
  return !(status === 'cancelled');
};

// Định nghĩa hàm sortSizes
export const sortSizes = sizes => {
  // Định nghĩa hàm so sánh để sắp xếp các kích thước từ nhỏ đến lớn
  const compareSizes = (size1, size2) => {
    // Sắp xếp theo thứ tự: S < M < L < XL
    const sizeOrder = {S: 0, M: 1, L: 2, XL: 3};

    // So sánh thứ tự của hai kích thước
    return sizeOrder[size1] - sizeOrder[size2];
  };

  // Sắp xếp mảng sizes từ nhỏ đến lớn
  sizes.sort(compareSizes);

  // Trả về mảng sizes đã sắp xếp
  return sizes;
};

export const getMinSizeAndPrice = priceBySize => {
  // Lấy danh sách các kích thước từ object keys
  const sizes = Object.keys(priceBySize);

  // Sắp xếp các kích thước từ nhỏ đến lớn
  const sortedSizes = sortSizes(sizes);

  // Lấy ra size nhỏ nhất từ mảng đã sắp xếp
  const minSize = sortedSizes[0];

  // Lấy giá trị tương ứng với size nhỏ nhất từ object priceBySize
  const minPrice = priceBySize[minSize];

  // Trả về một object chứa size nhỏ nhất và giá trị kèm theo
  return {size: minSize, price: minPrice};
};

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lấy tất cả Key
export const getAllKeyAndDataInAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);

    console.log(`\n\n AsyncStorage - ALLKEYS [${keys.length}]: ${keys}`);

    // Lặp qua mảng data để lấy ra dữ liệu tương ứng với mỗi key
    data.forEach((item, index) => {
      const key = item[0];
      const value = item[1];
      console.log(`\n - Key [${index + 1}]: ${key} => Value: ${value}`);
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

// Xóa tất cả key
export const removeAllKeyAndDataInAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log('AsyncStorage - Đã xóa tất cả key');
  } catch (error) {
    console.error('Lỗi khi xóa các key:', error);
  }
};
