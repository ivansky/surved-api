import { Entities, Types } from '../interfaces/interfaces';
import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType({ description: 'Survey object interface' })
export class Survey implements Entities.ISurvey {
    @Field()
    public id: string;

    @Field()
    public active: boolean;

    @Field(type => Int)
    public created: number;

    @Field()
    public title: string;
}
