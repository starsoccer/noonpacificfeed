import * as got from 'got';
import { ITrack } from '../types';

export default async function getTracksByMixtape(mixtapeID: string): Promise<ITrack[]> {
    const mixtapes = await got('https://beta.whitelabel.cool/api/tracks/', {
        headers: {
            Client: process.env.clientID || '',
        },
        query: {
            mixtape: mixtapeID,
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