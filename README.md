# Book Review System GraphQL API

This project implements a GraphQL API for a book review system using Node.js, TypeScript, Apollo Server, and Prisma. Users can register, login, add books, add reviews, and perform various queries related to books and reviews.

## Features

- User authentication using JWT tokens.
- CRUD operations for users, books, and reviews.
- Pagination for fetching books and reviews.
- Error handling and input validation.
- Unit testing for resolvers.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: Typed superset of JavaScript.
- **Apollo Server**: GraphQL server implementation.
- **Prisma**: Modern database toolkit for TypeScript and Node.js.
- **PostgreSQL**: Database management system.

## Getting Started

To get a local copy up and running follow these steps:

### Prerequisites

- Node.js (version 16.x)
- npm (version 7.x)
- PostgreSQL database

### Install dependencies:
- npm install

### Set up the database:
- Ensure PostgreSQL is running.
-  Configure your database connection URL in .env file:
- DATABASE_URL="postgresql://username:password@localhost:5432/book_review_system"
- Run Prisma migrations to initialize the database schema:
- npx prisma migrate dev

### Start the server:
- npm run dev(locally)
- The server should now be running at http://localhost:4000. You can explore the GraphQL API using tools like GraphQL Playground.

### Environment Variables
- Make sure to set the following environment variables in a .env file:

- DATABASE_URL: PostgreSQL database connection URL.
