"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
  .object({
    username: zod_1.z.string().min(3).max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    repeat_password: zod_1.z.string().min(6),
  })
  .refine((data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
  });
exports.registerSchema.refine((obj) => obj.password != obj.repeat_password);
exports.loginSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(6),
});
