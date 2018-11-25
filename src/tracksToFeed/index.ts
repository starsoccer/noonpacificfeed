import { Feed } from 'feed';
import { IEnhancedTrack } from '../types';

export default function tracksToFeed (tracks: IEnhancedTrack[], feed: Feed) {
    for (const track of tracks) {
        feed.addItem({
            title: `${track.mixtapeName} - ${track.title}`,
            id: track.id.toString(),
            link: track.permalink_url,
            description: `${track.artist}-${track.title}`,
            content: `${track.artist}-${track.title}`,
            date: track.date,
            image: track.artwork_url,
        });
    }
}