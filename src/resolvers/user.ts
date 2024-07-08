import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Prisma } from '@prisma/client';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();

const generateToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const userResolvers = {
  Query: {
    getMyReviews: authMiddleware(async (_: any, __: any, { user }: any) => {
      return await prisma.review.findMany({ where: { userId: user.userId } });
    }),
  },
  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, email, password: hashedPassword },
        });
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        return { token, refreshToken, user };
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            const target = err.meta?.target as string[];
            if (target.includes('email')) {
              throw new UserInputError('User already exists with this email');
            } else if (target.includes('username')) {
              throw new UserInputError('Username is already taken');
            }
          }
        }
        throw new Error('Failed to register user');
      }
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      return { token, refreshToken, user };
    },
    refreshToken: async (_: any, { token }: any) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.user.findUnique({ where: { id: (decoded as any).userId } });
        if (!user) {
          throw new AuthenticationError('Invalid token');
        }
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        return { token: newToken, refreshToken: newRefreshToken, user };
      } catch (err) {
        throw new AuthenticationError('Invalid token');
      }
    },
  },
  User: {
    reviews: async (parent: any) => await prisma.review.findMany({ where: { userId: parent.id } }),
  },
};
