import { Field, ID, InterfaceType } from 'type-graphql';
import { ObjectId } from 'mongodb';

export type IId<T extends any = string> = T;

export type EntityID = IId | ObjectId;

type PickObjectID<T, K extends keyof T> = {
    [P in K]: ObjectId;
};

type PickIID<T, K extends keyof T> = {
    [P in K]: ObjectId;
};

@InterfaceType()
export abstract class EntityAbstract {
    @Field(type => ID)
    public readonly id?: EntityID;
    public readonly _id?: EntityID;
}

interface IBaseEntityObject { [field: string]: any; }

export type IEntityIDs<T extends IBaseEntityObject> = Extract<keyof T, EntityID>;

type IdToObjectId<T> = {
    [K in keyof T]: T[K] extends EntityID ? ObjectId : T[K];
};

export type IDbEntity<T extends IBaseEntityObject> = Pick<IdToObjectId<T>, Exclude<keyof IdToObjectId<T>, '_id'>> & {
    _id: ObjectId;
};

export type IEntity<T extends IBaseEntityObject> = Pick<T, Exclude<keyof T, '_id'>>;
