import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { ModalTemplateDirective } from './directives/modal-template.directive';
import { ConfirmationService } from './confirmation.service';

@NgModule({
  declarations: [ModalComponent, ModalTemplateDirective],
  imports: [CommonModule],
  exports: [ModalComponent, ModalTemplateDirective],
  providers: [ConfirmationService],
})
export class ConfirmModalModule {}
