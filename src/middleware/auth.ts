// src/middleware/auth.ts
import { AuthenticationError } from "apollo-server-errors";
import jwt from "jsonwebtoken";

export const getUserFromToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return null;
  }
};

export const createContext = ({ req }: any) => {
  const token = req.headers.authorization || "";
  const user = getUserFromToken(token);
  return { user };
};

export const authMiddleware = (resolver: any) => {
  return (parent: any, args: any, context: any, info: any) => {
    if (!context.user) {
      throw new AuthenticationError("You must be logged in");
    }
    return resolver(parent, args, context, info);
  };
};
