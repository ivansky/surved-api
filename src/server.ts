import express from 'express';
import graphqlHTTP from 'express-graphql';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const PORT = process.env.PORT || 1234;

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: makeExecutableSchema({
        resolvers,
        typeDefs: fs.readFileSync('server/schema.gql').toString(),
    }),
}));

app.listen(PORT);

console.log('🌎 Server on port', PORT);
