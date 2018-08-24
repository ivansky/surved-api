import { IDbEntity, IEntity, IEntityIDs } from 'abstract.type.ts';
import { ObjectId } from 'mongodb';

export interface IConverter<T> {
    toDbObject(entity: IEntity<T>): IDbEntity<T>;
    toEntity(dbObject: IDbEntity<T>): IEntity<T>;
}

export function makeEntityConverter<T extends object>(idFields: Array<IEntityIDs<T>>): IConverter<T> {
    return {
        toDbObject: (entity: IEntity<T>): IDbEntity<T> => {
            const entityKeys: Array<keyof IEntity<T>> = Object.keys(entity) as any;

            return entityKeys.reduce((objectEntity, key) => {
                const resultKey = key === 'id' ? '_id' : key;
                return Object.assign({}, objectEntity, {
                    [resultKey]: idFields.includes(key as any) || key === 'id'
                        // @ts-ignore
                        ? new ObjectId(entity[key])
                        : entity[key],
                });
            }, {} as IDbEntity<T>);
        },
        toEntity: (dbObject: IDbEntity<T>): IEntity<T> => {
            const entityKeys: Array<keyof IDbEntity<T>> = Object.keys(dbObject) as any;

            return entityKeys.reduce((entity, key) => {
                const resultKey = key === '_id' ? 'id' : key;
                return Object.assign({}, entity, {
                    [resultKey]: idFields.includes(key as any) || key === '_id'
                        // @ts-ignore
                        ? new ObjectId(dbObject[key])
                        : dbObject[key],
                });
            }, {} as IEntity<T>);
        },
    };
}
