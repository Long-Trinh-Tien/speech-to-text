# speech-to-text

To start, we need to create `.env` file as follow:
GEMINI_API_KEY=<OUR-API-KEY-HERE>

Backend server need `index.js` to create API endpoint.
gemini.js is for interacting with gemini API

How to run: **npm run dev** . This command will run both backend and frontend.

Dependency: (just run `npm install` in parent directory)

--------------------------------------------------------------------
# 🧠 Speech-to-Text AI Chat App

> Chat ứng dụng AI siêu mượt, hỗ trợ nhập giọng nói, phản hồi thông minh, và lưu lịch sử theo user. Được build bằng React + Node.js + OpenAI Gemini (có thể tuỳ biến).

---

## 🚀 Tính năng chính

- 🎙️ **Ghi âm giọng nói** và chuyển sang văn bản (STT)
- 💬 **Chat AI** với phản hồi thông minh (sử dụng Gemini API hoặc mô hình tuỳ chọn)
- 📁 **Lưu lịch sử hội thoại** theo từng user (`username.json`)
- 🔐 **Đăng nhập / Đăng ký** với context lưu username
- 📦 Code tách riêng rõ ràng: UI, hook, service, backend

---

## 🧪 Cài đặt & Chạy thử

### 1. Cài dependencies

```bash
cd <to base>
npm install .
```
### 2. Chạy server và frontend
# Terminal
```npm run dev```

## 🧠 Refactor & Design Highlights

### 🧩 Tách logic ra hooks & services
- Phần xử lý STT (speech-to-text) được chuyển sang `hooks/useSpeechToText.js`
- Gửi & nhận tin nhắn qua `services/ChatService.jsx`
- Gọn code, dễ bảo trì, dễ test, scale lên chức năng mới cũng đơn giản hơn.

### 💡 Auto-scroll khi có tin nhắn mới
- Sử dụng `useRef` + `scrollTo` trong `Chatbox.jsx`
- UX mượt như nhung, không cần kéo tay.

### 🧼 Clean code
- Dùng `async/await`, xử lý lỗi rõ ràng.
- Tránh callback hell, tránh setState loạn.
- Kiểm tra input, tránh gửi tin nhắn rỗng.

### ⚙️ Mở rộng dễ như ăn bánh
- Có thể thêm:
  - Voice-to-voice: ghép luôn TTS đầu ra
  - Upload file / ảnh đính kèm
  - Đổi nhân vật AI, cài sẵn prompt role
  - Theme tuỳ biến hoặc Dark Mode auto

---

## 🧔 Devs nên biết

- Code theo tư duy **modular**, chia rõ components / logic / data.
- Hooks tự viết được, tái sử dụng dễ.
- UI component tách riêng:
  - `ChatMessage`: hiển thị 1 message
  - `ChatInput`: xử lý input và nút voice

## Backend Sequence Diagram
```mermaid
sequenceDiagram
    participant Client
    participant Backend as Backend (index.js)
    participant Login as login.js
    participant Register as register.js
    participant Gemini as gemini.js
    participant Files as Data Files (JSON)
    participant GeminiAPI as Gemini API

    %% Đăng ký
    Client->>Backend: POST /register (username, password)
    Backend->>Register: userRegister(username, password)
    Register->>Files: Read user.json
    Files-->>Register: User data
    Register->>Files: Write new user to user.json
    Register-->>Backend: Success (201)
    Backend-->>Client: { status: 201, message, user }

    %% Đăng nhập
    Client->>Backend: POST /login (username, password)
    Backend->>Login: userCheck(username, password)
    Login->>Files: Read user.json
    Files-->>Login: User data
    Login-->>Backend: Success (200) or Error (401)
    Backend-->>Client: { status, message, user }

    %% Kiểm tra token
    Client->>Backend: POST /user-token (token)
    Backend->>Login: tokenCheck(token)
    Login->>Files: Read user.json
    Files-->>Login: User data
    Login-->>Backend: Success (200) or Error (401)
    Backend-->>Client: { status, message, user }

    %% Gửi tin nhắn đến Gemini
    Client->>Backend: POST /api/message (message)
    Backend->>Gemini: sendMessageToGemini(message)
    Gemini->>GeminiAPI: POST Gemini API
    GeminiAPI-->>Gemini: Response
    Gemini-->>Backend: Gemini response
    Backend-->>Client: Gemini response or Error (500)

    %% Lưu tin nhắn
    Client->>Backend: POST /save-message (username, messages)
    Backend->>Files: Read <username>.json (if exists)
    Files-->>Backend: Existing messages
    Backend->>Files: Write combined messages to <username>.json
    Backend-->>Client: { success: true } or Error (400/500)

    %% Lấy lịch sử tin nhắn
    Client->>Backend: GET /get-history/:username
    Backend->>Files: Read <username>.json
    Files-->>Backend: Messages
    Backend-->>Client: { messages } or Error (404)

    %% Dịch văn bản
    Client->>Backend: POST /translate (text)
    Backend->>Gemini: sendMessageToGemini(prompt)
    Gemini->>GeminiAPI: POST Gemini API
    GeminiAPI-->>Gemini: Translation + IPA
    Gemini-->>Backend: Parsed response
    Backend-->>Client: { translated, ipa } or Error (500)

    %% Lưu từ vựng
    Client->>Backend: POST /save-vocab (username, word, meaning, ipa)
    Backend->>Files: Read <username>_vocab.json (if exists)
    Files-->>Backend: Existing vocab
    Backend->>Files: Write new vocab to <username>_vocab.json
    Backend-->>Client: { success: true } or Error (400/500)

    %% Lấy từ vựng
    Client->>Backend: GET /get-vocab?username
    Backend->>Files: Read <username>_vocab.json
    Files-->>Backend: Vocab list
    Backend-->>Client: Vocab list or []

    %% Xóa từ vựng
    Client->>Backend: POST /delete-vocab (username, word)
    Backend->>Files: Read <username>_vocab.json
    Files-->>Backend: Vocab list
    Backend->>Files: Write updated vocab to <username>_vocab.json
    Backend-->>Client: { success: true } or Error (400/500)
```

