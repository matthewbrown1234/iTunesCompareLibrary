class LibraryFile {
    constructor(artist: string, song: string, albumArtist: string, album: string, albumDate: Date){
        this.artist = artist;
        this.song = song;
        this.albumArtist = albumArtist;
        this.album = album;
        this.albumDate = albumDate;
    }
    artist: string;
    song: string;
    albumArtist: string;
    album: string;
    albumDate: Date;
}