import fs from 'fs';
import { Dictionary } from 'lodash';
//import xml2js from 'xml2js';
const parseXmlStringToJson = require('xml2js').parseString;

export class LibraryFileProcessor {
    readonly OLD_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/old/Library.xml`;
    readonly NEW_FILE_PATH: string = `E://Workspaces/iTunesCompareLibrary/CompareFiles/new/Library.xml`;

    constructor(){}

    public async compareLibraries (): Promise<void> {
        const oldLibrary: string = await this.getFileData(this.OLD_FILE_PATH);
        const newLibrary: string = await this.getFileData(this.NEW_FILE_PATH);
        const oldLibraryXml: any = await this.convertXmlStringToJson(oldLibrary);
        const newLibraryXml: any = await this.convertXmlStringToJson(newLibrary);
        let asdf = newLibraryXml.plist.dict[0].dict[0].dict[0];
        console.log('asdf');
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
    // todo: this parses the data wrong!  this needs to actually work in a standard repeatable way.
    private async convertXmlStringToJson (xmlString: string): Promise<JSON>{
        return new Promise<JSON>((resolve) => {
            parseXmlStringToJson(xmlString, function(err: any, result: JSON) {
                if(err){
                    console.error(err);
                }
                resolve(result);
            });
        });
    }

    private convert (fileData: string, type: any) {

    }
}