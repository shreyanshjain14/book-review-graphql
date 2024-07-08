import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();

export const bookResolvers = {
  Query: {
    getBooks: async (_: any, { page = 1, limit = 10, search = "" }: any) => {
      const skip = (page - 1) * limit;
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
      });
      const totalBooks = await prisma.book.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
      return { books, totalBooks };
    },
    getBook: async (_: any, { id }: any) => {
      const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
      if (!book) throw new UserInputError('Book not found');
      return book;
    },
  },
  Mutation: {
    addBook: authMiddleware(async (_: any, { title, author, publishedYear }: any) => {
      try {
        return await prisma.book.create({ data: { title, author, publishedYear } });
      } catch (err) {
        throw new UserInputError('Failed to add book');
      }
    }),
  },
  Book: {
    reviews: async (parent: any) => await prisma.review.findMany({ where: { bookId: parent.id } }),
  },
};
