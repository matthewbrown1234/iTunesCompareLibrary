export default class LibrarySong {
    constructor(artist: string, song: string, albumArtist: string, album: string, albumDate: string){
        this.artist = artist;
        this.song = song;
        this.albumArtist = albumArtist;
        this.album = album;
        this.albumDate = albumDate;
    }
    public artist: string;
    public song: string;
    public albumArtist: string;
    public album: string;
    public albumDate: string;
}
