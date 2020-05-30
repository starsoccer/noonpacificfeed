export interface IMixtape {
    id: number;
    title: string;
    slug: string;
    description: string;
    artwork_url: string;
    artwork_credit_url: string;
    sponsor: string;
    product: string;
    product_url: string;
    release: number;
    track_cout: number;
    created: number;
    modified: number;
    collection: number;
}

export interface ITrack {
    id: number;
    mixtape: number;
    title: string;
    artist: string;
    slug: string;
    streamable: true;
    duration: number;
    external_id: number;
    stream_url: string;
    permalink_url: string;
    purchase_url: string;
    download_url: string;
    artwork_url: string;
    play_count: number;
    order: number;
}

export interface IEnhancedTrack extends ITrack {
    date: Date;
    mixtapeName: string;
}

export interface ICollection {
    id: number;
    title: string;
    slug: string;
    description: string;
    artwork_url: string;
    artwork_credit: string;
    artwork_credit_url: string;
    created: number;
    modified: number;
    mixtape_count: number;
}