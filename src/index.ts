import { LibraryFileProcessor } from "./FileProcessor/LibraryFileProcessor";

export class Startup {
    public static main(): number {
        const libraryFileProcessor = new LibraryFileProcessor();
        libraryFileProcessor.compareLibraries();
        return 0;
    }
}

Startup.main();