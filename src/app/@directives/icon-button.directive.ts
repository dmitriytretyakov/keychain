import {Directive, input, OnInit} from '@angular/core';
import {SharedButtonDirective} from "./shared-button.directive";

@Directive({
  selector: 'button[icon]',
  standalone: true,
  host: {
    class: 'icon-button button',
  }
})
export class IconButtonDirective extends SharedButtonDirective {

}
