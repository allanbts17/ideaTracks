export interface Song {
    category: string;
    song: string;
    data: RecordingData[];
}

export interface RecordingData {
    
    text?: string;
    path?: string;
    data?: string;
}
