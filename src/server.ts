const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
    /**
     * Source-map helps making useful stacktrace
     */
    require('source-map-support').install({
        environment: 'node',
    });
}

import 'reflect-metadata';
import chalk from 'chalk';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { GraphQLServer, Options } from 'graphql-yoga';
import { buildSchema } from 'type-graphql';

import makeSurveyResolver from './resolvers/survey.resolver';
import { makeDataBaseConnection } from './database';
import { initializeData } from './mock/initialize-data';

async function bootstrap() {
    let schema;

    const db = await makeDataBaseConnection('mongodb://localhost:27017', 'surved');

    if (NODE_ENV === 'development') {
        await initializeData(db);
    }

    try {
        schema = await buildSchema({
            resolvers: [
                makeSurveyResolver(db),
            ],
        });
    } catch (e) {
        throw new Error('Schema building fail :(');
    }

    // Create GraphQL server
    const server = new GraphQLServer({
        schema,
        context: {
            db,
        },
    });

    server.express.use(cookieParser());
    server.express.use(bodyParser());
    server.express.use(session({ secret: process.env.SECRET || 'some_secret_surved_string' }));
    server.express.use(passport.initialize());
    server.express.use(passport.session());

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

try {
    bootstrap();
} catch (e) {
    console.error(e);
}
