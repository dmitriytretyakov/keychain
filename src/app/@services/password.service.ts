import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor() {
  }

  generate(config: {
    length: number, // MIN = 3
    letters: boolean,
    numbers: boolean,
    special: boolean
  }) {
    if (config.length < 3) {
      throw new Error('Length must be 3 characters long');
    }
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&';
    let lettersCount = config.letters ? 1 : 0;
    let numbersCount = config.numbers ? 1 : 0;
    let specialCount = config.special ? 1 : 0;
    let i = lettersCount + numbersCount + specialCount;
    while (i < config.length) {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          if(config.letters) {
            lettersCount++;
            i++;
          }
          break;
        case 1:
          if(config.numbers) {
            numbersCount++;
            i++;
          }
          break;
        case 2:
          if(config.special) {
            specialCount++;
            i++;
          }
          break;
      }
    }
    let result = '';
    result += Array.from(crypto.getRandomValues(new Uint32Array(lettersCount)))
      .map((x) => letters[x % letters.length])
      .join('');

    result += Array.from(crypto.getRandomValues(new Uint32Array(numbersCount)))
      .map((x) => numbers[x % numbers.length])
      .join('');

    result += Array.from(crypto.getRandomValues(new Uint32Array(specialCount)))
      .map((x) => special[x % special.length])
      .join('');
    return [...result].sort(()=>Math.random()-.5).join(''); // Shuffle string
  }
}
