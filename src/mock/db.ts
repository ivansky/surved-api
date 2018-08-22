import { Entities } from '../interfaces/interfaces';

export type OptionDb = Entities.IOption;
export type QuestionDb = Entities.IQuestion & { options?: OptionDb[] };
export type SurveyDb = Entities.ISurvey & { questions?: QuestionDb[] };

const dataBase: {
    surveys: SurveyDb[];
} = {
    surveys: [
        {
            title: 'Survey 1',
            created: 1534772303,
            active: true,
            questions: [
                { surveyId: '101', question: 'Some question [201]?', type: 'text', multiLine: false },
                { surveyId: '101', question: 'Some question [202]?', type: 'text', multiLine: true },
                {
                    surveyId: '101', question: 'Some question [203]?', type: 'select', options: [
                        { questionId: '203', text: 'First' },
                        { questionId: '203', text: 'Second' },
                        { questionId: '203', text: 'Third' },
                    ],
                },
                {
                    surveyId: '101', question: 'Some question [204]?', type: 'radio', options: [
                        { questionId: '204', text: 'First' },
                        { questionId: '204', text: 'Second' },
                        { questionId: '204', text: 'Third' },
                    ],
                },
            ],
        },
        {

            title: 'Survey 2',
            created: 1534858703,
            active: true,
            questions: [
                { surveyId: '102', question: 'Some question [205]?', type: 'text', multiLine: false },
                { surveyId: '102', question: 'Some question [206]?', type: 'text', multiLine: true },
                {
                    surveyId: '102', question: 'Some question [207]?', type: 'select', options: [
                        { questionId: '207', text: 'First' },
                        { questionId: '207', text: 'Second' },
                        { questionId: '207', text: 'Third' },
                    ],
                },
                {
                    surveyId: '102', question: 'Some question [208]?', type: 'radio', options: [
                        { questionId: '208', text: 'First' },
                        { questionId: '208', text: 'Second' },
                        { questionId: '208', text: 'Third' },
                    ],
                },
            ],
        },
        {
            title: 'Survey 3',
            created: 1534945103,
            active: true,
        },
        {
            title: 'Survey 4',
            created: 1535031503,
            active: true,
        },
    ],
};

export default dataBase;
