import { Arg, Query, Resolver, ID, Mutation, Ctx } from 'type-graphql';
import { Db, ObjectId } from 'mongodb';

import { makeEntityConverter } from './abstract-converter';
import { Question, QuestionInput } from '../types/question.type';
import { IEntity } from '../types/abstract.type';

const questionConverter = makeEntityConverter<Question>(['surveyId']);

export default function makeQuestionResolver(db: Db) {

    const collection = db.collection('question');

    @Resolver()
    class QuestionResolver {

        @Query(returns => Question, { nullable: true })
        public async question(
            @Arg('id', type => ID) id: string,
        ): Promise<IEntity<Question>> {
            return await collection.findOne({ _id: new ObjectId(id) });
        }

        @Query(returns => [Question], { description: 'Get all questions' })
        public async questions(): Promise<Array<IEntity<Question>>> {
            const questions = await collection.find().toArray();
            return questions.map(questionConverter.toEntity);
        }

        @Mutation(returns => Question)
        public async addQuestion(
            @Arg('input') questionInput: QuestionInput,
            @Ctx() ctx: {},
        ): Promise<Question> {
            const {
                insertedId: _id,
            } = await collection.insertOne(
                questionConverter.toDbObject(questionInput),
            );

            return await collection.findOne({ _id });
        }
    }

    return QuestionResolver;
}
