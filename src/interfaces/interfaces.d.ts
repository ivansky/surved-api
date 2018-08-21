export namespace Types {
    export type ID = string;
}

export namespace Entities {
    export type QuestionType = 'text' | 'select' | 'radio';

    interface IAbstract {
        id: Types.ID;
    }

    export interface ISurvey extends IAbstract {
        title: string;
        created: number;
        active: boolean;
    }

    interface IBaseQuestion extends IAbstract {
        surveyId: Types.ID;
        question: string;
        type: QuestionType;
    }

    export interface ITextQuestion extends IBaseQuestion {
        type: 'text';
        multiLine: boolean;
    }

    export interface IChoiceQuestion extends IBaseQuestion {
        type: 'select' | 'radio';
    }

    export type IQuestion = ITextQuestion | IChoiceQuestion;

    export interface IOption extends IAbstract {
        questionId: Types.ID;
        text: string;
        image?: string;
    }

    export interface IUserOption extends IAbstract {
        optionId: Types.ID;
        userId: Types.ID;
    }

    export interface IUserText extends IAbstract {
        userId: Types.ID;
        text: string;
    }
}

export namespace Auth {
    export interface IUser {
        firstName: string;
    }

    export interface IExternalUser {
        userId: Types.ID;
        email: string;
    }
}
