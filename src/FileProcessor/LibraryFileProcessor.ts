import fs from 'fs';
const DOMParser = require('xmldom').DOMParser;
import xpath from 'xpath';

export class LibraryFileProcessor {
    readonly OLD_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/old/Library.xml`;
    readonly NEW_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/new/Library.xml`;

    constructor(){}

    public async compareLibraries (): Promise<void> {
        //const oldLibrary: string = await this.getFileData(this.OLD_FILE_PATH);
        const newLibrary: string = await this.getFileData(this.NEW_FILE_PATH);

        const newLibraryXml: XMLDocument = this.convertStringToXmlDocument(newLibrary);
        const newLibrarySongs: Array<XMLDocument> = this.getLibrarySongsFromXml(newLibraryXml);

        console.log('asdf');
        for (var i = 0; i < newLibrarySongs.length; i++){
            var key = newLibrarySongs[i];
            //newLibrarySongs[i].childNodes[1].textContent
        }
    }

    private getFileData (filePath: string): Promise<string> {
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

    private getLibrarySongsFromXml (xmlDocument: XMLDocument): Array<XMLDocument> {
        return <Array<XMLDocument>>xpath.select(`//dict//dict//dict`, xmlDocument);
    }

    private convertStringToXmlDocument (stringXml: string): XMLDocument {
        return (new DOMParser()).parseFromString(stringXml, "text/xml")
    }
}