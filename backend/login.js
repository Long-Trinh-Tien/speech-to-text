import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Tạo __dirname tương đương
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function userCheck(username, password) {
  return new Promise((resolve, reject) => {
    // Lấy path file user
    const filePath = path.join(__dirname, "data", "user.json");
    //Đọc file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject({ status: "500", error: "Can not load user data" });
      }
      const users = JSON.parse(data).users;

      const user = users.find((user) => {
        return user.username === username && user.password === password;
      });

      if (user) {
        resolve({ status: 200, message: "Login successfully", user });
      } else {
        reject({ status: 401, error: "Invalid username or password" });
      }
    });
  });
}
export function tokenCheck(token) {
  return new Promise((resolve, reject) => {
    // Lấy path file user
    const filePath = path.join(__dirname, "data", "user.json");
    //Đọc file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject({ status: "500", error: "Can not load user data" });
      }
      const users = JSON.parse(data).users;

      const user = users.find((user) => {
        return user.username === token;
      });

      if (user) {
        resolve({ status: 200, message: "Login successfully", user });
      } else {
        reject({ status: 401, error: "Invalid username or password" });
      }
    });
  });
}
