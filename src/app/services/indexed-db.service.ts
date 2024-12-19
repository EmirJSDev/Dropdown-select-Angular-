import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

// Тип данных, который мы будем сохранять
interface FunnelSelection {
  id: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    // Открываем или создаем базу данных
    this.dbPromise = openDB('selectionDB', 1, {
      upgrade(db) {
        // Создаем хранилище (Object Store) при первом открытии
        if (!db.objectStoreNames.contains('selections')) {
          db.createObjectStore('selections', { keyPath: 'id' });
        }
      },
    });
  }

  // Метод для сохранения данных
  async saveSelection(id: string, data: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put('selections', { id, data });
  }

  // Метод для загрузки данных
  async getSelection(id: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    const result = await db.get('selections', id);
    return result?.data;
  }

  // Метод для удаления данных
  async deleteSelection(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('selections', id);
  }

  // Метод для получения всех сохраненных данных
  async getAllSelections(): Promise<FunnelSelection[]> {
    const db = await this.dbPromise;
    return await db.getAll('selections');
  }
}
