import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './user';
import { reviewResolvers } from './review';
import { bookResolvers } from './book';

const resolvers = mergeResolvers([userResolvers, reviewResolvers, bookResolvers]);

export default resolvers;
