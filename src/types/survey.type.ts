import { Field, ObjectType, Int, ID } from 'type-graphql';
import { GraphQLString, GraphQLBoolean } from 'graphql';

import { EntityAbstract, EntityID } from './abstract.type';
import { Question } from './question.type';

@ObjectType({ description: 'Survey object interface' })
export default class Survey extends EntityAbstract {

    @Field(type => ID, { nullable: true })
    public authorId?: EntityID;

    @Field(type => GraphQLBoolean)
    public active: boolean;

    @Field(type => Int)
    public created: number;

    @Field(type => GraphQLString)
    public title: string;

    @Field(type => [Question])
    public questions: Question[];

}
