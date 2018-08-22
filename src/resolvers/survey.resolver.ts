import { Arg, Query, Resolver, ID } from 'type-graphql';
import { Survey } from '../types/survey.type';
import { Db, ObjectId } from 'mongodb';

export default function makeSurveyResolver(db: Db) {

    @Resolver()
    class SurveyResolver {

        @Query(returns => Survey, { nullable: true })
        public async survey(@Arg('id', type => ID) id: string) {
            return await db.collection('surveys').findOne({ _id: new ObjectId(id) });
        }

        @Query(returns => [Survey], { description: 'Get all surveys' })
        public async surveys(): Promise<Survey[]> {
            return await db.collection('surveys').find().toArray();
        }
    }

    return SurveyResolver;
}
