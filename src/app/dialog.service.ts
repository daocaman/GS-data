import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface option {
  class?: string,
  initialState?: any,
  ignoreBackdropClick?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  // Bootstrap Dialog
  openModal(template: any, data: option) {
    this.modalRef = this.modalService.show(template, data);
  }
  
  hideModal() {
    this.modalRef.hide();
  }
}
