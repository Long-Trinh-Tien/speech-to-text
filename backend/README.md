# Tài liệu Backend Ứng dụng

## 1. Tổng quan

Backend này là một ứng dụng server được xây dựng bằng **Node.js** và **Express**, cung cấp các API để hỗ trợ các tính năng:
- **Xác thực người dùng**: Đăng ký, đăng nhập, kiểm tra token.
- **Tương tác với Gemini API**: Gửi tin nhắn và dịch văn bản sang tiếng Việt kèm phiên âm IPA.
- **Quản lý tin nhắn**: Lưu và lấy lịch sử tin nhắn của người dùng.
- **Quản lý từ vựng**: Lưu, lấy, và xóa từ vựng của người dùng.

Backend sử dụng file JSON để lưu trữ dữ liệu và tích hợp với **Gemini API** để xử lý các yêu cầu liên quan đến AI.

---

## 2. Yêu cầu hệ thống

### 2.1. Yêu cầu phần mềm
- **Node.js**: Phiên bản 14.x hoặc cao hơn.
- **npm**: Đi kèm với Node.js để cài đặt các thư viện phụ thuộc.
- **Hệ điều hành**: Windows, macOS, hoặc Linux.

### 2.2. Phụ thuộc
Danh sách các thư viện được cài đặt thông qua `npm install`:
- `express`: Framework để xây dựng API.
- `cors`: Cho phép truy cập cross-origin từ frontend.
- `node-fetch`: Gửi yêu cầu HTTP đến Gemini API.
- `dotenv`: Quản lý biến môi trường (API key).

### 2.3. Cấu hình
- Tạo file `.env` trong thư mục gốc với nội dung:
  ```
  GEMINI_API_KEY=<your_gemini_api_key>
  ```
- Tạo thư mục `data` trong thư mục gốc để lưu các file JSON:
  - `user.json`: Lưu danh sách người dùng.
  - `<username>.json`: Lưu lịch sử tin nhắn của người dùng.
  - `<username>_vocab.json`: Lưu danh sách từ vựng của người dùng.

---

## 3. Cài đặt và chạy

1. **Cài đặt phụ thuộc**:
   ```bash
   npm install
   ```

2. **Khởi động server**:
   ```bash
   node index.js
   ```
   Server sẽ chạy tại `http://localhost:3000`.

3. **Kiểm tra**:
   - Dùng công cụ như **Postman** hoặc **cURL** để gửi yêu cầu đến các endpoint.
   - Ví dụ: Gửi `POST http://localhost:3000/login` với body:
     ```json
     { "username": "test", "password": "pass" }
     ```

---

## 4. Cấu trúc mã nguồn

- **`index.js`**: File chính, định nghĩa các endpoint API và điều phối yêu cầu.
- **`login.js`**: Xử lý đăng nhập và kiểm tra token.
- **`register.js`**: Xử lý đăng ký người dùng.
- **`gemini.js`**: Giao tiếp với Gemini API.
- **Thư mục `data`**: Lưu trữ file JSON cho người dùng, tin nhắn, và từ vựng.

---

## 5. Mô tả API

Dưới đây là danh sách các endpoint API, bao gồm phương thức, tham số, và phản hồi.

### 5.1. Đăng ký người dùng
- **Endpoint**: `POST /register`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (201)**:
    ```json
    {
      "status": 201,
      "message": "User registered successfully",
      "user": { "username": "string", "password": "string" }
    }
    ```
  - **Lỗi (409)**: Username đã tồn tại.
  - **Lỗi (500)**: Không thể lưu dữ liệu người dùng.

### 5.2. Đăng nhập
- **Endpoint**: `POST /login`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    {
      "status": 200,
      "message": "Login successfully",
      "user": { "username": "string", "password": "string" }
    }
    ```
  - **Lỗi (401)**: Username hoặc password không đúng.
  - **Lỗi (500)**: Không thể tải dữ liệu người dùng.

### 5.3. Kiểm tra token
- **Endpoint**: `POST /user-token`
- **Body**:
  ```json
  {
    "token": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    {
      "status": 200,
      "message": "Login successfully",
      "user": { "username": "string", "password": "string" }
    }
    ```
  - **Lỗi (401)**: Token không hợp lệ.
  - **Lỗi (500)**: Không thể tải dữ liệu người dùng.

### 5.4. Gửi tin nhắn đến Gemini
- **Endpoint**: `POST /api/message`
- **Body**:
  ```json
  {
    "message": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**: Trả về phản hồi từ Gemini API.
  - **Lỗi (500)**: Lỗi khi gọi Gemini API.

### 5.5. Lưu tin nhắn
- **Endpoint**: `POST /save-message`
- **Body**:
  ```json
  {
    "username": "string",
    "messages": ["string"]
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    { "success": true }
    ```
  - **Lỗi (400)**: Thiếu username hoặc messages.
  - **Lỗi (500)**: Không thể lưu tin nhắn.

### 5.6. Lấy lịch sử tin nhắn
- **Endpoint**: `GET /get-history/:username`
- **Tham số**: `username` (trong URL).
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    { "messages": ["string"] }
    ```
  - **Lỗi (404)**: Không tìm thấy lịch sử tin nhắn.

### 5.7. Dịch văn bản
- **Endpoint**: `POST /translate`
- **Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    {
      "translated": { "text": "string" },
      "ipa": "string"
    }
    ```
  - **Lỗi (400)**: Thiếu văn bản cần dịch.
  - **Lỗi (500)**: Lỗi khi gọi Gemini API.

### 5.8. Lưu từ vựng
- **Endpoint**: `POST /save-vocab`
- **Body**:
  ```json
  {
    "username": "string",
    "word": "string",
    "meaning": "string",
    "ipa": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    { "success": true }
    ```
  - **Lỗi (400)**: Thiếu trường bắt buộc.
  - **Lỗi (500)**: Không thể lưu từ vựng.

### 5.9. Lấy danh sách từ vựng
- **Endpoint**: `GET /get-vocab?username=<username>`
- **Tham số**: `username` (query parameter).
- **Phản hồi**:
  - **Thành công (200)**: Trả về mảng từ vựng:
    ```json
    [
      { "word": "string", "meaning": "string", "ipa": "string", "savedAt": "ISODate" }
    ]
    ```
  - **Thành công (200, rỗng)**: `[]` nếu không có từ vựng.
  - **Lỗi (400)**: Thiếu username.
  - **Lỗi (500)**: Không thể đọc file từ vựng.

### 5.10. Xóa từ vựng
- **Endpoint**: `POST /delete-vocab`
- **Body**:
  ```json
  {
    "username": "string",
    "word": "string"
  }
  ```
- **Phản hồi**:
  - **Thành công (200)**:
    ```json
    { "success": true }
    ```
  - **Lỗi (400)**: Thiếu username hoặc word.
  - **Lỗi (404)**: Không tìm thấy file từ vựng.
  - **Lỗi (500)**: Không thể xóa từ vựng.

---

## 6. Lưu ý quan trọng

### 6.1. Bảo mật
- **Mật khẩu**: Hiện tại, mật khẩu được lưu dưới dạng văn bản thô trong `user.json`. Nên sử dụng thư viện như `bcrypt` để mã hóa mật khẩu.
- **Token**: Hàm `tokenCheck` sử dụng username làm token, không an toàn. Nên triển khai **JWT** hoặc session-based authentication.
- **API Key**: Đảm bảo file `.env` không được đưa lên hệ thống quản lý mã nguồn (ví dụ: `.gitignore`).

### 6.2. Hiệu suất
- Lưu trữ file JSON (`fs`) không phù hợp cho hệ thống có nhiều người dùng đồng thời. Nên chuyển sang cơ sở dữ liệu như **MongoDB** hoặc **PostgreSQL**.
- Các endpoint như `/save-message`, `/save-vocab` có thể gặp vấn đề đồng bộ khi nhiều yêu cầu ghi file cùng lúc.

### 6.3. Tích hợp với Frontend
- Theo `README.md`, frontend cần sử dụng `UserContext.jsx` để lưu username sau khi đăng nhập.
- Đảm bảo CORS được cấu hình phù hợp với domain của frontend.

### 6.4. Cải tiến đề xuất
- **Xác thực**: Thêm middleware xác thực cho các endpoint yêu cầu đăng nhập (ví dụ: `/save-message`, `/get-history`).
- **Rate Limiting**: Thêm giới hạn số lượng yêu cầu API để tránh lạm dụng.
- **Logging**: Sử dụng thư viện như `winston` để ghi log lỗi và hoạt động.
- **Kiểm thử**: Viết unit test cho các hàm trong `login.js`, `register.js`, và `gemini.js` bằng `Jest`.

---

## 7. Ví dụ sử dụng

### 7.1. Đăng ký người dùng
```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"user1","password":"pass123"}'
```

### 7.2. Đăng nhập
```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"user1","password":"pass123"}'
```

### 7.3. Gửi tin nhắn đến Gemini
```bash
curl -X POST http://localhost:3000/api/message -H "Content-Type: application/json" -d '{"message":"Hello, how are you?"}'
```

### 7.4. Lưu từ vựng
```bash
curl -X POST http://localhost:3000/save-vocab -H "Content-Type: application/json" -d '{"username":"user1","word":"hello","meaning":"xin chào","ipa":"həˈloʊ"}'
```

---

## 8. Kết luận

Backend này cung cấp một nền tảng đơn giản nhưng đầy đủ tính năng cho một ứng dụng học ngoại ngữ hoặc chatbot. Tuy nhiên, để triển khai thực tế, cần cải thiện bảo mật, hiệu suất, và khả năng mở rộng. Tài liệu này cung cấp thông tin cần thiết để triển khai, bảo trì, và tích hợp với frontend.

---

## 9. Note
Backend server need `index.js` to create API endpoint.
gemini.js is for interacting with gemini API

How to run: node index.js

Dependency: nodejs (just run `npm install` in parent directory)

! How to save username ?
1. Create UserContext.jsx to have a provider that boundaround "App"
2. After login, save username by using function in UserContext.jsx