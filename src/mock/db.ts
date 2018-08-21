import { Entities } from '../interfaces/interfaces';

const dataBase: {
    questions: Entities.IQuestion[];
    surveys: Entities.ISurvey[];
    options: Entities.IOption[];
} = {
    options: [
        { id: '301', questionId: '203', text: 'First' },
        { id: '302', questionId: '203', text: 'Second' },
        { id: '303', questionId: '203', text: 'Third' },
        { id: '304', questionId: '204', text: 'First' },
        { id: '305', questionId: '204', text: 'Second' },
        { id: '305', questionId: '204', text: 'Third' },
        { id: '306', questionId: '207', text: 'First' },
        { id: '307', questionId: '207', text: 'Second' },
        { id: '308', questionId: '207', text: 'Third' },
        { id: '309', questionId: '208', text: 'First' },
        { id: '310', questionId: '208', text: 'Second' },
        { id: '311', questionId: '208', text: 'Third' },
    ],
    questions: [
        { id: '201', surveyId: '101', question: 'Some question [201]?', type: 'text', multiLine: false },
        { id: '202', surveyId: '101', question: 'Some question [202]?', type: 'text', multiLine: true },
        { id: '203', surveyId: '101', question: 'Some question [203]?', type: 'select' },
        { id: '204', surveyId: '101', question: 'Some question [204]?', type: 'radio' },
        { id: '205', surveyId: '102', question: 'Some question [205]?', type: 'text', multiLine: false },
        { id: '206', surveyId: '102', question: 'Some question [206]?', type: 'text', multiLine: true },
        { id: '207', surveyId: '102', question: 'Some question [207]?', type: 'select' },
        { id: '208', surveyId: '102', question: 'Some question [208]?', type: 'radio' },
    ],
    surveys: [
        { id: '101', title: 'Survey 1', created: 1534772303, active: true },
        { id: '102', title: 'Survey 2', created: 1534858703, active: true },
        { id: '103', title: 'Survey 3', created: 1534945103, active: true },
        { id: '104', title: 'Survey 4', created: 1535031503, active: true },
    ],
};

export default dataBase;
