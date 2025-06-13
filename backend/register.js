import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Tạo __dirname tương đương
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ➡️ Hàm đăng ký user mới
export function userRegister(username, password) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "data", "user.json");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject({ status: "500", error: "Can not load user data" });
      }

      const jsonData = JSON.parse(data);
      const users = jsonData.users || [];

      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        return reject({ status: 409, error: "Username already exists" });
      }

      // Thêm user mới
      const newUser = { username, password };
      users.push(newUser);

      // Ghi lại vào file
      const updatedData = JSON.stringify({ users }, null, 2);

      fs.writeFile(filePath, updatedData, "utf8", (err) => {
        if (err) {
          return reject({ status: "500", error: "Can not save new user" });
        }
        resolve({
          status: 201,
          message: "User registered successfully",
          user: newUser,
        });
      });
    });
  });
}
