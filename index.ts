import { IMixtape } from './src/types';
import { getMixtapes } from './src/getMixtapes';
import { Feed } from 'feed';
import { mixtapeToFeed } from './src/MixtapeToFeed';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
    const clientID = process.env.Client || '';
    const mixtapes: IMixtape[] = await getMixtapes(clientID).catch((err) => {
        console.log(err); return [];
    });
    const feed = new Feed({
        feed: '',
        title: "Feed Title",
        description: "This is my personal feed!",
        id: "http://example.com/",
        link: "http://example.com/",
        image: "http://example.com/image.png",
        favicon: "http://example.com/favicon.ico",
        copyright: "All rights reserved 2013, John Doe",
        updated: new Date(2013, 6, 14), // optional, default = today
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
          json: "https://example.com/json",
          atom: "https://example.com/atom"
        },
        author: {
          name: "John Doe",
          email: "johndoe@example.com",
          link: "https://example.com/johndoe"
        }
    });
    mixtapeToFeed(mixtapes, feed);
    console.log(feed.rss2());
}

test();