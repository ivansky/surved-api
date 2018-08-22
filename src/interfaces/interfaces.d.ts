export namespace Entities {
    export type QuestionType = 'text' | 'select' | 'radio';

    interface IAbstract {
        _id?: any;
    }

    export interface ISurvey extends IAbstract {
        title: string;
        created: number;
        active: boolean;
    }

    interface IBaseQuestion extends IAbstract {
        surveyId: any;
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
        questionId: any;
        text: string;
        image?: string;
    }

    export interface IUserOption extends IAbstract {
        optionId: any;
        userId: any;
    }

    export interface IUserText extends IAbstract {
        userId: any;
        text: string;
    }
}

export namespace Auth {
    export interface IUser {
        firstName: string;
    }

    export interface IExternalUser {
        userId: any;
        email: string;
    }
}
