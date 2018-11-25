import * as got from 'got';
import { IMixtape } from '../types';

export default async function getMixtapes(collectionID: number): Promise<IMixtape[]> {
    const mixtapes = await got('https://beta.whitelabel.cool/api/mixtapes/', {
        headers: {
            Client:  process.env.clientID || '',
        },
        query: {
            collection: collectionID,
        }
    });
    if (mixtapes.statusCode === 200) {
        try {
            const mixtapesJSON = JSON.parse(mixtapes.body);
            if ('results' in mixtapesJSON) {
                return mixtapesJSON.results;
            } else {
                throw new Error('results not found in json object');
            }
        } catch (ex) {
            throw ex;
        }
    } else {
        throw new Error('200 status code not returned');
    }
}