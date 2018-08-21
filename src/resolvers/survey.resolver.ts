import { ResolverInterface, Resolver } from 'type-graphql';
import dataBase from '../mock/db';
import { Entities } from '../interfaces/interfaces';
import { Survey } from '../types/survey.type';

@Resolver(of => Survey)
export class SurveyResolver implements ResolverInterface<Survey> {
    private items: Entities.ISurvey[] = dataBase.surveys;
}
