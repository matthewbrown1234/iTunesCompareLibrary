import fs from 'fs';
import xpath from 'xpath';
import LibrarySong from './LibrarySong';
import { isNull } from 'util';
const DOMParser = require('xmldom').DOMParser;

export class LibraryFileProcessor {
    readonly OLD_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/old/Library.xml`;
    readonly NEW_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/new/Library.xml`;

    constructor(){}

    public async compareLibraries (): Promise<void> {
        const asdf: Array<LibrarySong> = await this.getSongsFromFile(this.NEW_FILE_PATH);
        //const asdf: Array<Song> = await this.getSongsFromFile(this.OLD_FILE_PATH);
    }

    private async getSongsFromFile(filePath: string): Promise<Array<LibrarySong>> {
        return new Promise<Array<LibrarySong>>(async (resolve) => {
            const songLibraryString: string = await this.getFileContents(this.NEW_FILE_PATH);
            const libraryXml: XMLDocument = this.convertStringToXmlDocument(songLibraryString);
            const librarySongs: Array<LibrarySong> = this.getLibrarySongsFromXml(libraryXml);
            resolve(librarySongs);
        });
    }

    private getFileContents (filePath: string): Promise<string> {
        return new Promise<string>((resolve) => {
            fs.readFile(filePath, 'utf8', function(err: any, fd: any){
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error('my file does not exist');
                        return;
                    }
                    throw err;
                }
                resolve(fd);
            })
        });
    }

    private getLibrarySongsFromXml (xmlDocument: XMLDocument): Array<LibrarySong> {
        let songs: Array<LibrarySong> = new Array<LibrarySong>();
        const librarySongs: Array<XMLDocument> = <Array<XMLDocument>>xpath.select(`//dict//dict//dict`, xmlDocument);
        for (let i = 0; i < librarySongs.length; i++){
            const librarySongXml: XMLDocument = librarySongs[i];
            const artistName: string = this.getLibrarySongAttributeValueFromKey(librarySongXml, "Artist");
            const songName: string = this.getLibrarySongAttributeValueFromKey(librarySongXml, "Name");
            const albumArtistName: string = this.getLibrarySongAttributeValueFromKey(librarySongXml, "Album Artist");
            const albumName: string = this.getLibrarySongAttributeValueFromKey(librarySongXml, "Album");
            const albumDate: string = this.getLibrarySongAttributeValueFromKey(librarySongXml, "Year");
            const song = new LibrarySong(artistName,songName,albumArtistName,albumName,albumDate);
            songs.push(song);
        }
        return songs;
    }

    private getLibrarySongAttributeValueFromKey (librarySongXml: XMLDocument, key: string): string{
        var keyXml: XMLDocument = <XMLDocument>xpath.select(`//key[text()="${key}"]`, librarySongXml)[0];
        return keyXml.nextSibling ? <string>keyXml.nextSibling.textContent : "";
    }

    private convertStringToXmlDocument (stringXml: string): XMLDocument {
        return (new DOMParser()).parseFromString(stringXml, "text/xml")
    }
}