import * as i0 from "@angular/core";
export declare class IndexDBService {
    private dbPromise;
    constructor();
    private initDB;
    private withDBStore;
    loadDataFromDB<T>(storeName: string): Promise<T>;
    deleteDataFromDB(storeName: string): Promise<void>;
    storeDataToDB(storeName: string, data: any): Promise<void>;
    loadDataAuthDB(): Promise<any>;
    loadDataPermissionDB(): Promise<string[]>;
    deleteDataAuthDB(): Promise<void>;
    deleteDataPermissionDB(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IndexDBService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IndexDBService>;
}
