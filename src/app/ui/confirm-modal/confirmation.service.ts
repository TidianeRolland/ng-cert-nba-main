import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class ConfirmationService {
  openModalSubj = new Subject<ModalConfig>();
  openModalRequest$: Observable<ModalConfig> =
    this.openModalSubj.asObservable();

  constructor() {}

  confirm(payload: ModalConfig) {
    this.openModalSubj.next(payload);
  }
}

export enum ModalEventType {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
}

export interface ModalConfig {
  header?: string;
  body?: string;
  accept: () => void;
  reject: (
    modalEventType?: ModalEventType.REJECT | ModalEventType.CANCEL
  ) => void;
}
