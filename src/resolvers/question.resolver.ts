import { Arg, Query, Resolver, ID, Mutation, Ctx } from 'type-graphql';
import { Db, ObjectId } from 'mongodb';

import { Question } from '../types/question.type';
import { BaseConverter } from './abstract-converter';

const questionConverter = new BaseConverter<Question>();

export default function makeQuestionResolver(db: Db) {

    const collection = db.collection('question');

    @Resolver()
    class QuestionResolver {

        @Query(returns => Question, { nullable: true })
        public async question(@Arg('id', type => ID) id: string) {
            return await collection.findOne({ _id: new ObjectId(id) });
        }

        @Query(returns => [Question], { description: 'Get all questions' })
        public async questions(): Promise<Question[]> {
            const questions = await collection.find().toArray();
            return questions.map(questionConverter.toEntity);
        }

        @Mutation()
        public async addQuestion(
            @Arg("data") questionData: Question,
            @Ctx() ctx: {},
        ): Promise<Question> {
            const {
                insertedId: questionObjectId,
            } = await collection.insertOne(questionData);

            return questionConverter.toEntity({ ...questionData, _id: questionObjectId });
        }
    }

    return QuestionResolver;
}
