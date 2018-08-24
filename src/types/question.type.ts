import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

import { EntityAbstract, EntityID, IId } from './abstract.type';
import { Option } from './option.type';

export enum QuestionType {
    TEXT = 'text',
    SELECT = 'select',
    RADIO = 'radio',
}

registerEnumType(QuestionType, {
    name: 'QuestionType',
    description: 'Question type enum',
});

@ObjectType()
export abstract class Question extends EntityAbstract {

    @Field(type => ID)
    public surveyId: EntityID;

    @Field()
    public question: string;

    @Field(type => QuestionType)
    public type: QuestionType;

    @Field(type => [Option], { nullable: true })
    public options?: Option[];

    @Field({ nullable: true })
    public multiLine?: boolean | null;

}

@InputType({ description: 'New Question data' })
export abstract class QuestionInput implements Partial<Question> {

    @Field(type => ID)
    public surveyId: IId;

    @Field()
    public question: string;

    @Field(type => QuestionType)
    public type: QuestionType;

    @Field({ nullable: true })
    public multiLine?: boolean | null;

}

export type ITextQuestion = Question & {
    type: QuestionType.TEXT;
    multiLine: boolean;
};

export type IChoiceQuestion = Pick<Question, Exclude<keyof Question, 'multiLine'>> & {
    type: QuestionType.SELECT | QuestionType.RADIO;
};

export type IQuestion = ITextQuestion | IChoiceQuestion;
