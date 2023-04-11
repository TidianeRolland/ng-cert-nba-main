import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appModalTemplate]',
})
export class ModalTemplateDirective {
  @Input('appModalTemplate') type!: 'header' | 'body' | 'footer';

  constructor(public templateRef: TemplateRef<unknown>) {}
}
