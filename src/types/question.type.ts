import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { EntityAbstract, IID } from './abstract-entity';
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

export abstract class QuestionInput {

}

@ObjectType()
export abstract class Question extends EntityAbstract {

    @Field(type => ID)
    public surveyId: IID;

    @Field()
    public question: string;

    @Field(type => QuestionType)
    public type: QuestionType;

    @Field(type => [Option], { nullable: true })
    public options: Option[];

    @Field({ nullable: true })
    public multiLine: boolean | null;
}

export type ITextQuestion = Question & {
    type: QuestionType.TEXT;
    multiLine: boolean;
};

export type IChoiceQuestion = Pick<Question, Exclude<keyof Question, 'multiLine'>> & {
    type: QuestionType.SELECT | QuestionType.RADIO;
};

export type IQuestion = ITextQuestion | IChoiceQuestion;
