import {
  AfterContentChecked,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ModalTemplateDirective } from '../directives/modal-template.directive';
import {
  ConfirmationService,
  ModalConfig,
  ModalEventType,
} from '../confirmation.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements AfterContentChecked {
  constructor(private confirmServ: ConfirmationService) {
    this.openModalRequest$ = this.confirmServ.openModalRequest$.pipe(
      tap((data) => {
        this.isVisible = true;
        this.modalConfig = data;
      })
    );
  }

  isVisible = false;
  openModalRequest$: Observable<ModalConfig>;
  modalConfig!: ModalConfig;
  ModalEventType = ModalEventType;

  @ContentChildren(ModalTemplateDirective)
  protected readonly templateDirectives: QueryList<ModalTemplateDirective> | null =
    null;

  protected headerTemplate: TemplateRef<unknown> | null = null;
  protected bodyTemplate: TemplateRef<unknown> | null = null;
  protected footerTemplate: TemplateRef<unknown> | null = null;

  ngAfterContentChecked(): void {
    this.templateDirectives?.forEach((templateDirective) => {
      switch (templateDirective.type) {
        case 'header':
          this.headerTemplate = templateDirective.templateRef;
          break;
        case 'body':
          this.bodyTemplate = templateDirective.templateRef;
          break;
        case 'footer':
          this.footerTemplate = templateDirective.templateRef;
          break;
      }
    });
  }

  // input to custom css

  // output event

  accept() {
    // close dialog
    this.isVisible = false;
    this.modalConfig.accept();
  }

  reject(modalEvent?: ModalEventType.REJECT | ModalEventType.CANCEL) {
    this.isVisible = false;
    this.modalConfig.reject(modalEvent);
  }

  customEmit() {}
}
