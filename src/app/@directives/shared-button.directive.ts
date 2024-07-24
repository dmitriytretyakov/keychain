import {Directive, HostBinding, input, OnInit} from '@angular/core';

@Directive({
  selector: '[sharedButton]',
  standalone: true
})
export abstract class SharedButtonDirective implements OnInit {

  theme = input<'primary'>('primary');
  constructor() { }

  ngOnInit() {

  }

  @HostBinding('class.primary-button') get primaryTheme() {
    return this.theme() === 'primary';
  }

}
