if (process.env.NODE_ENV === 'development') {
    /**
     * Source-map helps making useful stacktrace
     */
    require('source-map-support').install({
        environment: 'node',
    });
}

import 'reflect-metadata';
import chalk from 'chalk';
import { GraphQLServer, Options } from 'graphql-yoga';
import { buildSchema } from 'type-graphql';

import { SurveyResolver } from './resolvers/survey.resolver';

async function bootstrap() {
    // build TypeGraphQL executable schema
    const schema = await buildSchema({
        resolvers: [
            SurveyResolver,
        ],
    });

    // Create GraphQL server
    const server = new GraphQLServer({ schema });

    // Configure server options
    const serverOptions: Options = {
        port: process.env.PORT || 4000,
        endpoint: "/graphql",
        playground: "/playground",
    };

    // Start the server
    return server.start(serverOptions, ({ port, playground }) => {
        console.log(chalk.cyan(
            `Server is running at http://localhost:${port}${playground}`,
        ));
    });
}

bootstrap();
