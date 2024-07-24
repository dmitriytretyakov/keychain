import {Directive} from '@angular/core';
import {SharedButtonDirective} from "./shared-button.directive";

@Directive({
  selector: 'button, button[button]',
  standalone: true,
  host: {
    class: 'button',
  }
})
export class ButtonDirective extends SharedButtonDirective {

}
