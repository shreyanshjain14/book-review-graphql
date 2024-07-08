import { PrismaClient } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();

export const reviewResolvers = {
  Query: {
    getReviews: async (_: any, { bookId, page = 1, limit = 10 }: any) => {
      const skip = (page - 1) * limit;
      const reviews = await prisma.review.findMany({
        where: { bookId: parseInt(bookId) },
        skip,
        take: limit,
      });
      const totalReviews = await prisma.review.count({
        where: { bookId: parseInt(bookId) },
      });
      return { reviews, totalReviews };
    },
  },
  Mutation: {
    addReview: authMiddleware(
      async (_: any, { bookId, rating, comment }: any, { user }: any) => {
        // Check if the book with the given bookId exists
        const bookIdNum = parseInt(bookId, 10);
        const book = await prisma.book.findUnique({
          where: { id: bookIdNum },
        });
        if (!book) {
          throw new UserInputError("Book not found", {
            invalidArgs: ["bookId"],
          });
        }
        return await prisma.review.create({
          data: {
            bookId: parseInt(bookId),
            rating,
            comment,
            userId: user.userId,
          },
        });
      }
    ),
    updateReview: authMiddleware(
      async (_: any, { reviewId, rating, comment }: any, { user }: any) => {
        const review = await prisma.review.findUnique({
          where: { id: parseInt(reviewId) },
        });
        if (!review) throw new UserInputError("Review not found");
        if (review.userId !== user.userId) {
          throw new AuthenticationError("Not authorized");
        }
        try {
          return await prisma.review.update({
            where: { id: parseInt(reviewId) },
            data: { rating, comment },
          });
        } catch (err) {
          throw new UserInputError("Failed to update review");
        }
      }
    ),
    deleteReview: authMiddleware(
      async (_: any, { reviewId }: any, { user }: any) => {
        const review = await prisma.review.findUnique({
          where: { id: parseInt(reviewId) },
        });
        if (!review) throw new UserInputError("Review not found");
        if (review.userId !== user.userId) {
          throw new AuthenticationError("Not authorized");
        }
        try {
          return await prisma.review.delete({
            where: { id: parseInt(reviewId) },
          });
        } catch (err) {
          throw new UserInputError("Failed to delete review");
        }
      }
    ),
  },
  Review: {
    user: async (parent: any) =>
      await prisma.user.findUnique({ where: { id: parent.userId } }),
    book: async (parent: any) =>
      await prisma.book.findUnique({ where: { id: parent.bookId } }),
  },
};
