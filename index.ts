import { IMixtape, ITrack, ITrackWithDate } from './src/types';
import getMixtapes from './src/getMixtapes';
import { Feed } from 'feed';
import mixtapeToFeed from './src/mixtapeToFeed';
import getTracksByMixtape from './src/getTracksByMixtape';
import tracksToFeed from './src/tracksToFeed';
import * as dotenv from 'dotenv';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cron from 'cron';

if (!process.env.NOW) {
    dotenv.config();
}
const CronJob = cron.CronJob;
const mixtapes: IMixtape[] = [];
const tracks : ITrackWithDate[] = [];
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

// Setup cron job
new CronJob('0 0 */3 * * *', getNewMixtapes, undefined, true, 'America/Los_Angeles', undefined, true);

async function getNewMixtapes() {
    const newMixtapes: IMixtape[] = await getMixtapes().catch((err) => {
        console.log(err); return [];
    });
    newMixtapes.forEach( async (newMixtape) => {
        const mixtapesWithMatchingIDs = mixtapes.filter((mixtape) => mixtape.id === newMixtape.id);
        if (mixtapesWithMatchingIDs.length === 0) {
            const newTracks = await getTracksByMixtape(newMixtape.id.toString()).catch((err) => {
                console.log(err); return [] as ITrack[];
            });
            newTracks.forEach((track) => tracks.push({
                ...track,
                date: new Date(newMixtape.created / 1000),
            }));
            mixtapes.push(newMixtape);
        }
    });
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


router.get('/debug', async () => {
    console.log(tracks);
});


app.use(router.routes());

app.listen(3000);


