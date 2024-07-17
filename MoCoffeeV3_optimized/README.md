# Ứng dụng đặt đồ uống cho Mồ Coffee & Tea

Đây là dự án ứng dụng cho phép khách hàng đặt đồ uống trực tuyến cho cửa hàng Mồ Coffee & Tea. Dự án được xây dựng bằng React Native và sử dụng Firebase làm cơ sở dữ liệu và quản lý người dùng.

## Hướng dẫn cài đặt

1. **Clone repository**

   ```bash
   git clone https://github.com/haduc25/DATN-2024.git
   cd DATN-2024/MoCoffeeV3_optimized

2. **Cài đặt dependencies**

   ```bash
   npm install

3. **Chạy ứng dụng**

   ```bash
   npx expo start

## Import file database

- Để import dữ liệu mẫu cho cơ sở dữ liệu, bạn cần thực hiện các bước sau:

- Đăng nhập vào Firebase Console

- Thêm một project mới hoặc chọn project hiện tại của bạn

- Chọn mục "Database" và "Realtime Database"

- Chọn biểu tượng ba chấm ở cạnh "Realtime Database" và chọn "Import JSON"

- Chọn file JSON chứa dữ liệu mẫu và import

Ví dụ:
   ```bash
   database-mo-coffee-tea-v3-backup-05-05-2024.json
   ```

## Chức năng của ứng dụng

- Xem sản phẩm
  
- Thêm, sửa, xóa sản phẩm (CRUD)
  
- Tìm kiếm và lọc sản phẩm theo loại
  
- Thống kê đơn hàng
  
- Quản lý đơn hàng và thông tin cá nhân

## Công nghệ sử dụng

- JavaScript

- React Native

- Expo

- CSS

- Redux

- Firebase (Authentication, Realtime Database)
