import { IEnhancedTrack } from './../types';

export default function sortTracks (tracks: IEnhancedTrack[]): IEnhancedTrack[] {
    return tracks.sort(compareCreatedDate);
}

function compareCreatedDate(track1: IEnhancedTrack, track2: IEnhancedTrack): number {
    return track1.date.getTime() - track2.date.getTime();
}