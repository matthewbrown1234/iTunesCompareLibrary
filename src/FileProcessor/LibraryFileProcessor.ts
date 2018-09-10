import fs from 'fs';
import LibrarySong from './LibrarySong';
import lodash from 'lodash';
const DOMParser = require('xmldom').DOMParser;

export class LibraryFileProcessor {
    readonly OLD_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/old/Library.xml`;
    readonly NEW_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/new/Library.xml`;

    readonly DIFFERENCES_FILE: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/differences.json`;

    constructor(){}

    public async compareLibraries (): Promise<void> {
        const newLibrarySongs: Array<LibrarySong> = await this.getSongsFromFile(this.NEW_FILE_PATH);
        const oldLibrarySongs: Array<LibrarySong> = await this.getSongsFromFile(this.OLD_FILE_PATH);
        console.log(`newLibrarySongs length: ${newLibrarySongs.length}`);
        console.log(`oldLibrarySongs length: ${oldLibrarySongs.length}`);
        const differences: Array<LibrarySong> = lodash.differenceWith(oldLibrarySongs, newLibrarySongs, (a,b) => {
            return a.album === b.album && a.albumArtist === b.albumArtist && a.albumDate === b.albumDate && a.artist === b.artist && a.song === b.song;
        } );
        console.log(`differences found`);
        await this.writeFile(this.DIFFERENCES_FILE, JSON.stringify(differences));
        console.log(`differences file saved to ${this.DIFFERENCES_FILE}`);
        //process.exit(-1);
    }

    private writeFile(filePath: string, data: string): Promise<void> {
        return new Promise<void>((resolve) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    throw err;
                }  
                resolve();        
            });
        })
    }

    private async getSongsFromFile(filePath: string): Promise<Array<LibrarySong>> {
        return new Promise<Array<LibrarySong>>(async (resolve) => {
            const songLibraryString: string = await this.getFileContents(filePath);
            console.log(`${filePath} file contents loaded`);
            const libraryXml: XMLDocument = this.convertStringToXmlDocument(songLibraryString);
            console.log(`file contents converted to XML`);
            const librarySongs: Array<LibrarySong> = this.getLibrarySongsFromXml(libraryXml);
            console.log(`file contents processed`);
            console.log(`Finished processing ${filePath}`);
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
    //todo: this is really slow!
    private getLibrarySongsFromXml (xmlDocument: XMLDocument): Array<LibrarySong> {
        let songs: Array<LibrarySong> = new Array<LibrarySong>();
        const librarySongs: any =  (<any>xmlDocument.childNodes[4].childNodes[1].childNodes[27]).getElementsByTagName('dict');
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
        let librarySongAttribute: string = "";
        const keys: any = librarySongXml.getElementsByTagName("key");
        for(let i = 0; i < keys.length; i ++){
            const keyItem = keys[i];
            if(keyItem.textContent === key){
                librarySongAttribute = ((keyItem || <XMLDocument>{}).nextSibling || <XMLDocument>{}).textContent;
                break;
            }
        }
        return librarySongAttribute;
    }

    private convertStringToXmlDocument (stringXml: string): XMLDocument {
        return (new DOMParser()).parseFromString(stringXml, "text/xml")
    }
}