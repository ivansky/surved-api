import { Field, ID, ObjectType } from 'type-graphql';

import { EntityAbstract, IID } from './abstract-entity';
import { GraphQLString } from 'graphql';

@ObjectType()
export abstract class Option extends EntityAbstract {

    @Field(type => ID)
    public questionId: IID;

    @Field(type => GraphQLString)
    public text: string;

    @Field({ nullable: true })
    public image: string | null = null;

}

export interface IUserOption {
    optionId: any;
    userId: any;
}

export interface IUserText {
    userId: any;
    text: string;
}
