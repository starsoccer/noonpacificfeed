import { Feed } from 'feed';
import { ITrack, ITrackWithDate } from '../types';

export default function tracksToFeed (tracks: ITrackWithDate[], feed: Feed) {
    for (const track of tracks) {
        feed.addItem({
            title: track.title,
            id: track.id.toString(),
            link: track.permalink_url,
            description: track.title + ' ' + track.artist,
            content:  track.title + ' ' + track.artist,
            date: track.date,
            image: track.artwork_url,
        });
    }
}