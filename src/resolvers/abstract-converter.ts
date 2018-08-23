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

export class BaseConverter<T extends object> extends AbstractConverter<T> {}

export function makeEntityConverter(idFields: string[]) {
    export class BaseConverter<T extends object> extends AbstractConverter<T> {

    }
}
