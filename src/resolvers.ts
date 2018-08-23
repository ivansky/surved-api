import { Entities, Types } from './interfaces';
import db from './mock/db';

function comparator(a, b, descending) {
    return (descending ? (a > b) : (a < b)) ? -1 : 1;
}

type Filter<T> = (element: T) => boolean;

function filtrator<T = object>(element: T, filter?: Filter<T>) {
    return !filter || !Object.keys(filter).some((key) => {
        const type = typeof element[key];
        if (type === 'string') {
            return !element[key].startsWith(filter[key]);
        } else if (type === 'number') {
            const filterValue = filter[key];
            const match = filterValue.match(/[0-9]+/);
            const number = Number(filterValue.substr(match.index));
            const op = filterValue.substr(0, match.index);
            /* eslint-disable indent */
            switch (op) {
                case '>': return !(element[key] > number);
                case '>=': return !(element[key] >= number);
                case '<': return !(element[key] < number);
                case '<=': return !(element[key] <= number);
                case '=':
                case '':
                    return !(element[key] === number);
                default:
                    throw new Error(`Unknown op (${op})`);
            }
            /* eslint-enable indent */
        }
        throw new Error('Unknown data type');
    });
}

function find<T = any, K extends keyof T = keyof T>(
    collection: T[],
    page: number = 0,
    perPage: number,
    sortField: K,
    descending: boolean,
    filter: Filter<T>,
) {
    const filtered = collection.filter((element: T) => filtrator(element, filter));
    const sorted = sortField ? filtered.sort((a, b) =>
        comparator(a[sortField], b[sortField], descending)) : filtered;
    return perPage ? sorted.slice(page * perPage, (page * perPage) + perPage) : sorted;
}

function count<T = any>(collection: T[], filter: Filter<T>) {
    return collection.filter((element: T) => filtrator(element, filter)).length;
}

const resolvers = {
    Query: {
        options: (_, { questionId }: { questionId: Types.ID }) =>
            db.options.filter((option) => option.questionId === questionId),

        questions: (_, { surveyId }: { surveyId: Types.ID }) =>
            db.questions.filter((question) => question.surveyId === surveyId),

        surveys: (_, {}) =>
            db.surveys,
    },
    Question: {
        options: ({ id }: Entities.IQuestion) =>
            db.options.filter((option) => option.questionId === id),
    },
    Survey: {
        questions: ({ id }: Entities.ISurvey) =>
            db.questions.filter((question) => question.surveyId === id),
    },
};

export default resolvers;
