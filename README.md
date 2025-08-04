# KIENSTORE - Game Store Website

Một website bán game trực tuyến với admin panel đầy đủ chức năng CRUD, tích hợp MongoDB và deploy trên Railway/Vercel.

## 🚀 Tính năng

### Frontend
- ✅ Giao diện responsive với Bootstrap 5
- ✅ Trang chủ với slider và banner
- ✅ Danh sách game với filter và search
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng và thanh toán
- ✅ Đăng ký/Đăng nhập
- ✅ Profile người dùng
- ✅ Wishlist
- ✅ Lịch sử đơn hàng

### Backend API
- ✅ RESTful API với Express.js
- ✅ Authentication với JWT
- ✅ MongoDB với Mongoose
- ✅ Validation với express-validator
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ Security với helmet

### Admin Panel
- ✅ Dashboard với thống kê
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý người dùng
- ✅ Quản lý đơn hàng
- ✅ Upload ảnh
- ✅ Phân quyền admin

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Font Awesome
- LocalStorage API

### Backend
- Node.js
- Express.js
- MongoDB với Mongoose
- JWT Authentication
- bcryptjs (mã hóa mật khẩu)
- express-validator
- helmet (security)
- cors
- dotenv

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd asm-website
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Tạo file .env
```bash
cp env.example .env
```

Cập nhật các biến môi trường trong file `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kienstore
MONGODB_URI_PROD=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/kienstore

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@kienstore.com
ADMIN_PASSWORD=admin123456
```

### 4. Chạy MongoDB
Đảm bảo MongoDB đã được cài đặt và chạy trên máy local, hoặc sử dụng MongoDB Atlas.

### 5. Chạy ứng dụng
```bash
# Development
npm run dev

# Production
npm start
```

Truy cập: http://localhost:5000

## 🔧 Cấu trúc thư mục

```
asm-website/
├── css/
│   └── styles.css
├── images/
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── games.js
│   ├── main.js
│   ├── utils.js
│   └── admin.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── users.js
│   └── orders.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── utils/
│   ├── errorResponse.js
│   └── initAdmin.js
├── server.js
├── package.json
├── env.example
└── README.md
```

## 🚀 Deploy

### Deploy Backend trên Railway

1. **Tạo tài khoản Railway**
   - Truy cập [railway.app](https://railway.app)
   - Đăng ký tài khoản

2. **Connect GitHub**
   - Kết nối repository GitHub với Railway
   - Railway sẽ tự động detect Node.js project

3. **Cấu hình Environment Variables**
   - Vào tab "Variables"
   - Thêm các biến môi trường từ file `.env`
   - Đặc biệt cập nhật `MONGODB_URI_PROD` với MongoDB Atlas

4. **Deploy**
   - Railway sẽ tự động build và deploy
   - Lấy URL từ tab "Deployments"

### Deploy Frontend trên Vercel

1. **Tạo tài khoản Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng ký tài khoản

2. **Import Project**
   - Click "New Project"
   - Import từ GitHub repository
   - Vercel sẽ tự động detect static site

3. **Cấu hình**
   - Framework Preset: Other
   - Build Command: (để trống)
   - Output Directory: (để trống)
   - Install Command: (để trống)

4. **Environment Variables**
   - Thêm `VITE_API_URL` hoặc cập nhật API URL trong code

5. **Deploy**
   - Click "Deploy"
   - Vercel sẽ deploy và cung cấp URL

### Sử dụng Git để deploy

```bash
# 1. Khởi tạo Git repository
git init
git add .
git commit -m "Initial commit"

# 2. Push lên GitHub
git remote add origin <your-github-repo-url>
git push -u origin main

# 3. Railway và Vercel sẽ tự động deploy từ GitHub
```

## 🔐 Tài khoản Admin

Sau khi deploy, admin user sẽ được tự động tạo:
- **Email**: admin@kienstore.com
- **Password**: admin123456

Bạn có thể thay đổi trong file `.env`:
```env
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-admin-password
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/logout` - Đăng xuất

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Users
- `GET /api/users` - Lấy danh sách users (Admin)
- `GET /api/users/:id` - Lấy chi tiết user (Admin)
- `PUT /api/users/:id` - Cập nhật user (Admin)
- `DELETE /api/users/:id` - Xóa user (Admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

## 🎨 Customization

### Thay đổi theme
- Chỉnh sửa file `css/styles.css`
- Thay đổi màu sắc trong CSS variables

### Thêm tính năng mới
- Tạo model mới trong thư mục `models/`
- Tạo route mới trong thư mục `routes/`
- Cập nhật frontend JavaScript

## 🐛 Troubleshooting

### Lỗi MongoDB connection
- Kiểm tra MongoDB URI trong `.env`
- Đảm bảo MongoDB service đang chạy
- Kiểm tra network access nếu dùng MongoDB Atlas

### Lỗi CORS
- Cập nhật `CORS_ORIGIN` trong `.env`
- Thêm domain frontend vào whitelist

### Lỗi JWT
- Kiểm tra `JWT_SECRET` trong `.env`
- Đảm bảo secret key đủ mạnh

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề gì, vui lòng tạo issue trên GitHub hoặc liên hệ:
- Email: support@kienstore.com
- Website: https://kienstore.com

---

**Made with ❤️ by KIENSTORE Team** 