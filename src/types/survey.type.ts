import { Field, ObjectType, Int } from 'type-graphql';
import { GraphQLString, GraphQLBoolean } from 'graphql';

import { EntityAbstract } from './abstract-entity';
import { Question } from './question.type';

@ObjectType({ description: 'Survey object interface' })
export default class Survey extends EntityAbstract {
    @Field(type => GraphQLBoolean)
    public active: boolean;

    @Field(type => Int)
    public created: number;

    @Field(type => GraphQLString)
    public title: string;

    @Field(type => [Question])
    public questions: Question[];
}
