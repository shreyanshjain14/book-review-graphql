import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import resolvers from './resolvers';
import { createContext } from './middleware/auth';


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
