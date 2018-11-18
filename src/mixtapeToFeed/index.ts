import { Feed } from 'feed';
import { IMixtape } from '../types';

export function mixtapeToFeed (mixtapes: IMixtape[], feed: Feed) {
    for (const mixtape of mixtapes) {
        feed.addItem({
            title: mixtape.title,
            id: mixtape.id.toString(),
            link: 'https://noonpacific.com/los-angeles/' + mixtape.slug,
            description: mixtape.description,
            content: mixtape.description,
            date: new Date(mixtape.created / 1000),
            image: mixtape.artwork_url,
        });
    }
}