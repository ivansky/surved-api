import { MongoClient, Db } from 'mongodb';

export async function makeDataBaseConnection(uri: string, dbName: string): Promise<Db> {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
    });
    return client.db(dbName);
}
