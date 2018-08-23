import { Field, ID, InterfaceType } from 'type-graphql';
import { ObjectID } from 'bson';

export type IID = string;

export abstract class DbEntityAbstract {
    public readonly _id: ObjectID;
}

@InterfaceType()
export abstract class EntityAbstract {
    @Field(type => ID)
    public readonly id?: IID;
}

export type IDbEntity<T> = Pick<T, Exclude<keyof T, 'id'>> & {
    [P in keyof T]: T[P] extends IID ? ObjectID : T[P];
} & {
    readonly _id?: ObjectID;
};

export type IEntity<T> = T & {
    [P in keyof T]: T[P] extends ObjectID ? IID : T[P];
} & {
    readonly id?: string;
};
