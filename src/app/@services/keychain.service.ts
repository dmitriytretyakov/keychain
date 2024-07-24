import {Injectable} from '@angular/core';
import {KeychainRecord, KeychainRecordPayload} from "../@types/keychain-record";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

@Injectable({
  providedIn: 'root'
})
export class KeychainService {
  private fileHandle?: FileSystemFileHandle;
  passphrase!: string;

  get loaded() {
    return !!this.fileHandle;
  }

  private records: KeychainRecord[] = [
    // {
    //   id: '1',
    //   payload: {
    //     name: 'Yandex',
    //     login: 'test@yandex.ru',
    //     password: 'qwe123'
    //   }
    // },
    // {
    //   id: '2',
    //   payload: {
    //     name: 'VK',
    //     login: 'test@vk.ru',
    //     password: 'qwe1235'
    //   }
    // },
    // {
    //   id: '3',
    //   payload: {
    //     name: 'Youtube',
    //     login: 'test@youtube.ru',
    //     password: 'qwe1234'
    //   }
    // }
  ];

  constructor() {
  }

  async load() {
    return new Promise<void>(async (resolve, reject) => {
      const options = {
        types: [
          {
            description: 'Keychain file',
            accept: {
              'application/json': ['.keychain.json'],
            },
          },
        ],
      };
      //@ts-ignore
      const files = await window.showOpenFilePicker(options);
      if (files.length) {
        const fileContent = JSON.parse(await (await files[0].getFile()).text());
        try {
          this.records = JSON.parse(
            AES
              .decrypt(
                fileContent.records,
                this.passphrase = prompt('Введите пароль от связки')!
              )
              .toString(Utf8)
          );
          this.fileHandle = files[0];
          resolve();
        } catch (e) {
          reject('Incorrect password');
        }
      }
    });
  }

  async save() {
    if (this.fileHandle) {
      const writable = await this.fileHandle.createWritable();
      await writable.write(JSON.stringify({
        records: AES.encrypt(JSON.stringify(this.records), this.passphrase).toString(),
        version: '1.0'
      }));
      await writable.close();
    }
  }

  async add(payload: KeychainRecordPayload) {
    const id = crypto.randomUUID();
    this.records.push({
      id,
      payload
    });
    await this.save();
    return Promise.resolve(id);
  }

  async edit(id: string, payload: KeychainRecordPayload) {
    const record = this.records.find(x => x.id === id);
    if (record) {
      record.payload = payload;
      await this.save();
    }
  }

  async delete(id: string) {
    this.records = this.records.filter((record) => record.id !== id);
    await this.save();
  }

  search(query: string): KeychainRecord[] {
    return this.records.filter(x => x.payload.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }


}
