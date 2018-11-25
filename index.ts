import { IMixtape, ITrack, IEnhancedTrack, ICollection } from './src/types';
import getMixtapes from './src/getMixtapes';
import getCollections from './src/getCollections';
import { Feed } from 'feed';
import mixtapeToFeed from './src/mixtapeToFeed';
import getTracksByMixtape from './src/getTracksByMixtape';
import tracksToFeed from './src/tracksToFeed';
import sortTracks from './src/sortTracks';
import * as dotenv from 'dotenv';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cron from 'cron';

dotenv.config();

const collections: ICollection[] = [];

async function addCollections() {
    const collectionsToAdd: ICollection[] = await getCollections();
    collectionsToAdd.forEach((collection) => {
        collections.push(collection);
    });
    // Setup cron job
    new CronJob('0 0 */3 * * *', getNewMixtapes, undefined, true, 'America/Los_Angeles', undefined, true);  
}

addCollections();

const CronJob = cron.CronJob;
const mixtapes: IMixtape[] = [];
const tracks : IEnhancedTrack[] = [];
let lastUpdated: Date;
const feedData = {
    feed: '',
    title: "NoonPacific",
    description: "Noonpacific rss feed",
    id: "https://noonpacific.com/",
    link: "https://noonpacific.com/",
    image: "https://noonpacific.com/images/logo.svg",
    favicon: "https://noonpacific.com/favicon.png",
    copyright: "",
    generator: "", // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: "https://example.com/json",
      atom: "https://example.com/atom"
    }
};

async function getNewMixtapes() {
    const unsortedMixtapes: IMixtape[] = [];
    const unsortedTracks: IEnhancedTrack[] = [];
    for (const collection of collections) {
        const newMixtapes: IMixtape[] = await getMixtapes(collection.id).catch((err) => {
            console.log(err); return [];
        });
        for (const newMixtape of newMixtapes) {
            const mixtapesWithMatchingIDs: IMixtape[] = mixtapes.filter((mixtape) => mixtape.id === newMixtape.id);
            if (mixtapesWithMatchingIDs.length === 0) {
                const newTracks: ITrack[] = await getTracksByMixtape(newMixtape.id.toString()).catch((err) => {
                    console.log(err); return [] as ITrack[];
                });
                for (const track of newTracks) {
                    unsortedTracks.push({
                        ...track,
                        date: new Date(newMixtape.created),
                        mixtapeName: newMixtape.title
                    });
                }
                unsortedMixtapes.push(newMixtape);
            }
        }
    }
    const sortedTracks: IEnhancedTrack[] = sortTracks(unsortedTracks);
    const sortedMixtapes: IMixtape[] = unsortedMixtapes;
    sortedTracks.reverse().forEach((track) => tracks.push(track));
    sortedMixtapes.forEach((mixtape) => mixtapes.push(mixtape));
    lastUpdated = new Date();
}


const app = new Koa();
const router = new Router();

router.get('/mixtapes', async (ctx) => {
    const mixtapeFeed = new Feed(feedData);
    mixtapeToFeed(mixtapes, mixtapeFeed);
    ctx.body = mixtapeFeed.rss2();
});

router.get('/tracks', async (ctx) => {
    const tracksFeed = new Feed(feedData);
    tracksToFeed(tracks, tracksFeed);
    ctx.body = tracksFeed.rss2();
});

router.get('/status', async (ctx) => {
    ctx.body = `Last update ${lastUpdated}`;
});


app.use(router.routes());

app.listen(80);


