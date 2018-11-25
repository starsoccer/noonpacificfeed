import * as got from 'got';
import { ICollection } from '../types';

export default async function getCollections(): Promise<ICollection[]> {
    const collections = await got('https://beta.whitelabel.cool/api/collections/', {
        headers: {
            Client:  process.env.clientID || '',
        }
    });
    if (collections.statusCode === 200) {
        try {
            const collectionsJSON = JSON.parse(collections.body);
            if ('results' in collectionsJSON) {
                return collectionsJSON.results;
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