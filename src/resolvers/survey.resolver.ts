import { Arg, Query, Resolver, ID } from 'type-graphql';
import { Db, ObjectId } from 'mongodb';

import { IConverter, makeEntityConverter } from './abstract-converter';
import { IEntity, IId } from '../types/abstract.type';
import Survey from '../types/survey.type';

const surveyConverter: IConverter<Survey> = makeEntityConverter<Survey>(['authorId']);

export default function makeSurveyResolver(db: Db) {

    @Resolver()
    class SurveyResolver {

        @Query(returns => Survey, { nullable: true })
        public async survey(@Arg('id', type => ID) id: IId) {
            return await db.collection('surveys').findOne({ _id: new ObjectId(id) });
        }

        @Query(returns => [Survey], { description: 'Get all surveys' })
        public async surveys(): Promise<Array<IEntity<Survey>>> {
            const surveys = await db.collection('surveys').find().toArray();
            return surveys.map(surveyConverter.toEntity);
        }

    }

    return SurveyResolver;
}
