import { Field, ObjectType, Int } from 'type-graphql';
import { GraphQLString } from 'graphql';

@ObjectType({ description: 'Survey object interface' })
export class Survey {
    @Field(type => GraphQLString)
    public _id: string;

    @Field()
    public active: boolean;

    @Field(type => Int)
    public created: number;

    @Field()
    public title: string;
}
