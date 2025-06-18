# 🧠 Tổng Quan Kiến Trúc Ứng Dụng Frontend

Ứng dụng được xây dựng bằng **React**, sử dụng **React Router** để điều hướng và **Context API (UserContext)** để quản lý trạng thái người dùng toàn cục. Giao tiếp với backend được thực hiện thông qua các hàm gọi API bất đồng bộ.

---

## 📁 Chi Tiết Các Tệp

### 1. `src/main.jsx`
- **Mục đích**: Entry point của ứng dụng React.
- **Chức năng**:
  - Import các thư viện cần thiết (`StrictMode`, `createRoot`).
  - Import CSS toàn cục và component `App`.
  - Import `UserProvider` để cung cấp context toàn cục cho toàn ứng dụng.
  - Render `App` vào `#root` với `<StrictMode>`.

---

### 2. `src/App.jsx`
- **Mục đích**: Component chính, quản lý layout, điều hướng và trạng thái đăng nhập.
- **Chức năng**:
  - **State**:
    - `isLogin`: Đã đăng nhập hay chưa.
    - `isChecking`: Có đang kiểm tra token không.
  - **Authentication Flow**:
    - Dùng `useEffect` kiểm tra token trong `localStorage` khi load.
    - Gọi API `/user-token` để xác thực token.
  - **Routing**:
    - `/login`, `/register`: Hiển thị form tương ứng.
    - `/main`: Nếu đã đăng nhập thì hiển thị giao diện chính gồm:
      - `Header`, `SavedVocabList`, `Chatbox`.
    - Redirect dựa vào trạng thái đăng nhập.
  - **Logout**:
    - Xoá token, đặt `isLogin` thành `false`, xoá username.

---

### 3. `src/function/UserContext.jsx`
- **Mục đích**: Tạo context để quản lý `username` toàn cục.
- **Chức năng**:
  - Dùng `createContext`, `useState`.
  - Truyền `username` và `setUsername` thông qua `UserProvider`.

---

### 4. `src/function/sendMessageToBackend.jsx`
- **Mục đích**: Tập hợp các hàm gọi API backend.
- **Chức năng**:
  - `sendMessageToBackend(message)`
  - `sendLoginMessageToBackend(username, password)`
  - `sendRegisterMessageToBackend(username, password)`
  - `sendUserTokenToBackend(token)`
  - Tất cả dùng `fetch`, `Content-Type: application/json`.

---

### 5. `src/components/Login.jsx`
- **Mục đích**: Form đăng nhập người dùng.
- **State**:
  - `username`, `password`, `error`, `loading`, `rememberMe`
- **Chức năng**:
  - Gọi `sendLoginMessageToBackend`.
  - Nếu thành công → Cập nhật Context + Lưu token (nếu nhớ).
  - Nếu thất bại → Hiển thị lỗi.
- **UI**:
  - Form + checkbox "Remember me" + link tới `/register`.

---

### 6. `src/components/Register.jsx`
- **Mục đích**: Form đăng ký người dùng.
- **State**:
  - `username`, `password`, `confirmPassword`, `error`
- **Chức năng**:
  - Kiểm tra mật khẩu xác nhận.
  - Gọi `sendRegisterMessageToBackend`.
  - Hiển thị thông báo thành công/lỗi và chuyển hướng.
- **UI**:
  - Form + link quay lại `/login`.

---

### 7. `src/components/Chatbox.jsx`
- **Mục đích**: Giao diện chính cho chat AI.
- **State**:
  - `messages`, `inputValue`, `waitForAnswer`
- **Hooks**:
  - `useRef` để cuộn cuối.
  - `useSpeechToText` để nhận giọng nói.
- **Chức năng**:
  - Gửi tin nhắn, hiển thị phản hồi.
  - Load lịch sử chat từ backend.
- **UI**:
  - Hiển thị danh sách chat (`ChatMessage`), nhập liệu (`ChatInput`).

---

### 8. `src/components/ChatMessage.jsx`
- **Mục đích**: Hiển thị từng tin nhắn, cho phép dịch & lưu từ vựng.
- **State**:
  - `selectedText`, `translated`, `message`, `messageType`, `showSaveOption`
- **Chức năng**:
  - Khi bôi đen văn bản → gọi dịch → hiển thị nghĩa + IPA.
  - Nút "Save Vocabulary" → Gọi API lưu từ + dispatch event `vocabSaved`.
- **UI**:
  - Văn bản + Phát âm + popup thông báo.

---

### 9. `src/components/ChatInput.jsx`
- **Props**:
  - `inputValue`, `setInputValue`, `onSend`, `isRecording`, `toggleVoice`, `waitForAnswer`, `setMessages`
- **UI**:
  - `textarea` nhập nội dung.
  - Nút "Send", nút ghi âm (`VoiceButton`), và nút "Speak to AI" (`AiConversation`).

---

### 10. `src/components/VoiceButton.jsx`
- **Props**:
  - `isRecording`, `toggle`
- **Chức năng**:
  - Hiển thị icon ghi âm/dừng tương ứng.
  - CSS thay đổi tùy trạng thái.

---

### 11. `src/components/AiConversation.jsx`
- **Mục đích**: Giao tiếp liên tục với AI bằng giọng nói.
- **State & Refs**:
  - `isOnConversation`, `isSpeaking`, `recognitionRef`, v.v.
- **Chức năng**:
  - `startListening`: dùng `SpeechRecognition` để nghe.
  - `speak`: dùng `speechSynthesis` để đọc phản hồi.
  - `handleClick`: Bật/Tắt trạng thái hội thoại.
- **UI**:
  - Nút "Speak to AI" hoặc "Stop".

---

### 12. `src/components/SavedVocabList.jsx`
- **Mục đích**: Hiển thị và quản lý danh sách từ vựng đã lưu.
- **State**:
  - `vocabList`
- **Chức năng**:
  - Gọi `/get-vocab` để lấy từ.
  - Gọi `/delete-vocab` để xoá từ.
  - Lắng nghe sự kiện `vocabSaved` để tự động cập nhật danh sách.
- **UI**:
  - Danh sách từ + Nút xóa.

---

### 13. `src/function/speech-to-text.jsx`
- **Mục đích**: Tiện ích xử lý chuyển giọng nói thành văn bản.
- **Tham số**:
  - `tempResult`, `finalResult`, `recognition`
- **Chức năng**:
  - Thiết lập sự kiện `onresult`, `onend`, `onerror` cho `SpeechRecognition`.

---

### 14. `src/function/text-to-speech.jsx`
- **Mục đích**: Phát âm văn bản thành giọng nói.
- **Props**:
  - `inputText`
- **Chức năng**:
  - Dùng `useSpeech` từ `react-text-to-speech`.
  - Hiển thị các nút điều khiển (Play, Pause, Stop).

---

### 15. `src/components/oldChatbox.jsx`
- **Mục đích**: Phiên bản cũ hơn của `Chatbox`.
- **Chức năng tương tự**:
  - Gửi nhận tin nhắn, speech-to-text, text-to-speech.
  - Dùng class `Message`, hàm `renderMessages`.
- **Điểm khác biệt**:
  - Cách tổ chức logic và style có thể khác.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
