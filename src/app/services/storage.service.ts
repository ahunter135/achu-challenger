import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  data = null;
  cameFrom = "";
  constructor() {
    //Storage.clear();
  }

  async setItem(obj) {
    await Storage.set(obj);
  }

  async getItem(key) {
    const ret = await Storage.get({ key: key });
    const obj = JSON.parse(ret.value);

    return obj
  }

  async removeItem(key) {
    await Storage.remove({ key: key });
  }

  async getKeys() {
    const { keys } = await Storage.keys();

    return keys
  }

  async clearStorage() {
    await Storage.clear();
  }

  async setData(data) {
    this.data = data;
  }

  async getData() {
    return this.data;
  }
}
