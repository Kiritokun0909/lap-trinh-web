# ----- GIAI ĐOẠN 1: BUILD (Xây dựng ứng dụng React) -----
# Dùng một image Node.js để làm môi trường build

FROM node:18-alpine AS build-stage

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và cài đặt thư viện (Tận dụng cache)
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn frontend vào
COPY . .

# Chạy lệnh build để tạo ra các file tĩnh trong thư mục /app/build
RUN npm run build

# ----- GIAI ĐOẠN 2: PRODUCTION (Phục vụ các file đã build bằng Nginx) -----
# Dùng một image Nginx để phục vụ các file tĩnh đã build
FROM nginx:alpine AS production-stage

# Sao chép các file đã build từ giai đoạn 1 vào thư mục phục vụ của Nginx
COPY --from=build-stage /app/build /user/share/nginx/html

# Sao chép file cấu hình Nginx tùy chỉnh (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 để phục vụ ứng dụng (cổng mặc định của Nginx là 80)
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]