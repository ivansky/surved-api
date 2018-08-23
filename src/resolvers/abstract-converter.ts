import { IDbEntity, IEntity } from '../types/abstract-entity';
import { ObjectId } from 'mongodb';

export abstract class AbstractConverter<T extends object> {
    public toDbObject(entity: IEntity<T>): IDbEntity<T> {
        const dbObject = { ...(entity as any), _id: new ObjectId(entity.id) };
        delete dbObject.id;

        return dbObject;
    }

    public toEntity(dbObject: IDbEntity<T>): IEntity<T> {
        const entity = { ...(dbObject as any), id: dbObject._id.toHexString() };
        delete entity._id;

        return entity;
    }
}

export interface IConverter<T> {
    toDbObject(entity: IEntity<T>): IDbEntity<T>;
    toEntity(dbObject: IDbEntity<T>): IEntity<T>;
}

export function makeEntityConverter<T extends object>(idFields: string[]): IConverter<T> {
    return {
        toDbObject: (entity: IEntity<T>): IDbEntity<T> => {
            const keys: Array<keyof IEntity<T>> = Object.keys(entity) as any;

            keys.reduce<PartiIDbEntity<T>>(() => {

            })

            const dbObject = { ...(entity as any), _id: new ObjectId(entity.id) };
            delete dbObject.id;

            return dbObject;
        },
        toEntity: (dbObject: IDbEntity<T>): IEntity<T> => {
            const entity = { ...(dbObject as any), id: dbObject._id.toHexString() };
            delete entity._id;

            return entity;
        },
    };
}
