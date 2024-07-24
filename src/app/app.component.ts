import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {KeychainService} from "./@services/keychain.service";
import {PasswordService} from "./@services/password.service";
import {JsonPipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IconButtonDirective} from "./@directives/icon-button.directive";
import {ButtonDirective} from "./@directives/button.directive";
import {KeychainRecord} from "./@types/keychain-record";
import AES from "crypto-js/aes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, ReactiveFormsModule, IconButtonDirective, ButtonDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  keychain = inject(KeychainService);
  password = inject(PasswordService);
  searchInput = new FormControl('', []);
  creationMode = signal(false);
  visiblePassword = signal<string>('');
  onboardingVisible = signal(false);
  createForm = new FormGroup({
    name: new FormControl('', Validators.required),
    login: new FormControl(''),
    password: new FormControl('', Validators.required),
    comment: new FormControl(''),
  });
  passwordGenerationConfigForm = new FormGroup({
    length: new FormControl(12, Validators.required),
    letters: new FormControl(true),
    numbers: new FormControl(true),
    special: new FormControl(true),
  });

  ngOnInit() {
  }

  async load() {
    await this.keychain.load();
  }

  copyPassword(password: string) {
    navigator.clipboard.writeText(password);
    alert('Пароль скопирован в буфер обмена');
  }

  async submitCreation() {
    await this.keychain.add(this.createForm.value as any);
    this.creationMode.set(false);
    this.createForm.reset();
  }

  generateNewPassword() {
    return this.password.generate(this.passwordGenerationConfigForm.value as any);
  }

  showCreationForm() {
    this.createForm.get('password')?.setValue(
      this.generateNewPassword()
    );
    this.creationMode.set(true);
  }

  async deleteRecord(record: KeychainRecord) {
    const result = confirm(`Вы действительно хотите удалить запись "${record.payload.name}"?`);
    if(result) {
      await this.keychain.delete(record.id);
    }
  }

  downloadEmptyKeychain() {
    const data = JSON.stringify(
      {
        records: AES.encrypt(JSON.stringify([]), prompt('Придумайте пароль для связки')!).toString(),
        version: '1.0'
      }
    );
    const blob = new Blob([data], {type: 'application/json'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'my.keychain.json';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
    this.onboardingVisible.set(true);
  }
}
