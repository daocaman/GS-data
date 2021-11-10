import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hoa-don',
  templateUrl: './hoa-don.component.html',
  styleUrls: ['./hoa-don.component.scss']
})
export class HoaDonComponent implements OnInit {

  value: any;

  submitCall: any;

  orderDate = new Date();


  constructor(
    private bsModalRef: BsModalRef,
    private _route: Router
  ) { }

  ngOnInit() {

    let tmp = this.value.orderDate.split("/");
    this.orderDate = new Date(parseInt(tmp[2]), parseInt(tmp[1]) - 1, parseInt(tmp[0]));

  }

  get strDate() {
    return "Ngày " + (this.orderDate.getDate() + 1) + " tháng " + (this.orderDate.getMonth() + 1) + " năm " + this.orderDate.getFullYear();
  }

  get sum() {
    let dg = (this.value.dgSP == "") ? 0 : parseInt(this.value.dgSP);
    let sl = (this.value.numSP == null) ? 1 : this.value.numSP;

    let sumSP = dg * sl;

    let pk = (this.value.sumPK == "" || this.value.sumPK == null) ? 0 : parseInt(this.value.sumPK);

    let fee = (this.value.feeShip == "" || this.value.feeShip == null) ? 0 : parseInt(this.value.feeShip);

    let vat = (this.value.VAT == "" || this.value.VAT == null) ? 0 : parseInt(this.value.VAT);

    let giam = (this.value.giam == "" || this.value.giam == null) ? 0 : parseInt(this.value.giam);

    let tongTien = sumSP + pk + fee;
    return tongTien;
  }

  get detailOrder() {
    let res = ""

    res += (this.value.contentSP) ? "Ghi chữ: " + this.value.contentSP + ", " : "";
    res += (this.value.muong) ? this.value.muong + " bộ muỗng dĩa, " : "";
    res += (this.value.non) ? this.value.non + " Cái nón, " : "";
    res += (this.value.phao) ? this.value.phao + " pháo sáng, Dao cắt bánh, " : "";
    res += (this.value.nen) ? "Nến " + this.value.nen + ", " : "";
    res += (this.value.bich) ? "Bịch ni lông, " : "";
    res += (this.value.flan) ? this.value.flan + " flan, " : "";
    res += (this.value.phomai) ? this.value.phomai + " phô mai, " : "";

    res = res.trim();

    if (res.charAt(res.length - 1) == ",") {
      res = res.substring(0, res.length-1);
    }

    return res;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  confirm() {
    // this.closeModal();
    this.submitCall();
    this.bsModalRef.hide();
  }

}
