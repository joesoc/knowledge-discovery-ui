import { Injectable } from '@angular/core';
import { openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBDatabase;
  private dbName: string = 'IDOLPOC'; // Database name
  private storeName: string = 'vectorUIstore'; // Object store name
  private resolveDbReady!: (value: void | PromiseLike<void>) => void;

  constructor() {}

  async InitIndexDB(): Promise<void> {
    const db = await openDB(this.dbName);
    const tx = db.transaction(this.storeName, 'readonly');
  }

  public dbReady: Promise<void> = (async () => {
    await this.initDb();
  })();

  async initDb(): Promise<void> {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      // Correctly type the event target and assert the type of the result
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: Event) => {
      // Correctly type the event target and assert the type of the result
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event: Event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
    };
  }

  addItem(item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getItem(id: string): Promise<any> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
