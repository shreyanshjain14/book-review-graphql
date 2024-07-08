import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    reviews: [Review!]!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    user: User!
    book: Book!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type Query {
    getBooks(page: Int, limit: Int, search: String): BookPage!
    getBook(id: ID!): Book
    getReviews(bookId: ID!, page: Int, limit: Int): ReviewPage!
    getMyReviews: [Review!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    addBook(title: String!, author: String!, publishedYear: Int!): Book!
    addReview(bookId: ID!, rating: Int!, comment: String!): Review!
    updateReview(reviewId: ID!, rating: Int, comment: String): Review!
    deleteReview(reviewId: ID!): Review!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  type BookPage {
    books: [Book!]!
    totalBooks: Int!
  }

  type ReviewPage {
    reviews: [Review!]!
    totalReviews: Int!
  }
`;
