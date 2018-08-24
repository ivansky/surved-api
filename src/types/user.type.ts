import { Field, ObjectType } from "type-graphql";
import { EntityAbstract } from './abstract.type';

@ObjectType()
export abstract class User extends EntityAbstract {

    @Field()
    public name: string;

}
