import fs from 'fs';

export class LibraryFileProcessor {
    readonly OLD_FILE_PATH: string = "/CompareFiles/old";
    readonly NEW_FILE_PATH: string = "/CompareFiles/new";

    constructor(){}

    public async compareLibraries (): Promise<void> {
        console.log('asdf');
        //const oldLibrary = await this.getFileData(this.OLD_FILE_PATH);
        //const newLibrary = await this.getFileData(this.NEW_FILE_PATH);
        //const oldLibraryXml = (new DOMParser()).parseFromString(oldLibrary, "text/xml");
        //const newLibraryXml = (new DOMParser()).parseFromString(newLibrary, "text/xml");

        //const 
    }

    private getFileData (filePath: string): Promise<string> {
        return new Promise<string>((resolve) => {
            fs.readFile(filePath, 'r', function(err, fd){
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error('myfile does not exist');
                        return;
                    }
                    throw err;
                }
                resolve(fd);
            })
        });
    }

    private convertXmlToJson (xml: XMLDocument){

    }

    private processFile (fileData: string, type: any) {

    }
}