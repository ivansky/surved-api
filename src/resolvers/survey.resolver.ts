import { Arg, Query, Resolver, ID } from 'type-graphql';
import { Db, ObjectId } from 'mongodb';

import Survey from '../types/survey.type';
import { IDbEntity, IEntity, IID } from '../types/abstract-entity';

export class SurveyConverter {
    public static toDbObject(entity: IEntity<Survey>): IDbEntity<Survey> {
        const dbObject = { ...entity, _id: new ObjectId(entity.id) };
        delete dbObject.id;

        return dbObject;
    }

    public static toEntity(dbObject: IDbEntity<Survey>): IEntity<Survey> {
        const entity = { ...dbObject, id: dbObject._id.toHexString() };
        delete entity._id;

        return entity;
    }
}

export default function makeSurveyResolver(db: Db) {

    @Resolver()
    class SurveyResolver {

        @Query(returns => Survey, { nullable: true })
        public async survey(@Arg('id', type => ID) id: IID) {
            return await db.collection('surveys').findOne({ _id: new ObjectId(id) });
        }

        @Query(returns => [Survey], { description: 'Get all surveys' })
        public async surveys(): Promise<Survey[]> {
            const surveys = await db.collection('surveys').find().toArray();
            return surveys.map(SurveyConverter.toEntity);
        }

    }

    return SurveyResolver;
}
