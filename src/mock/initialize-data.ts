import { Db } from 'mongodb';
import dataBase, { OptionDb, QuestionDb, SurveyDb } from './db';

export async function initializeData(db: Db) {
    const surveys = db.collection('surveys');
    const questions = db.collection('questions');
    const options = db.collection('options');

    try {
        await surveys.deleteMany({});
        await questions.deleteMany({});
        await options.deleteMany({});
    } catch (e) {
        console.error('Removing shit happened', e);
    }

    try {
        await Promise.all(dataBase.surveys.map(async (survey: SurveyDb) => {
            const { insertedId: surveyId } = await surveys.insertOne({ ...survey, questions: undefined });

            return survey.questions ? Promise.all(survey.questions.map(async (question: QuestionDb) => {
                const {
                    insertedId: questionId,
                } = await questions.insertOne({ ...question, surveyId, options: undefined });

                return question.options ? Promise.all(question.options.map(async (option: OptionDb) => {
                    return await options.insertOne({ ...option, questionId });
                })) : null;
            })) : null;
        }));
    } catch (e) {
        console.error('Insertation shit happened', e);
    }
}