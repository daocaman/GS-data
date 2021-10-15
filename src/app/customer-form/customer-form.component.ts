import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GsService } from '../gs.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  type: String = "new";

  customerForm: FormGroup = new FormGroup({
    A: new FormControl(""),
    B: new FormControl(""),
    C: new FormControl(""),
    D: new FormControl(""),
    E: new FormControl(""),
    F: new FormControl(""),
    G: new FormControl(""),
    H: new FormControl(""),
    I: new FormControl(""),
    J: new FormControl(""),
  })

  quan = []

  constructor(
    private _gs: GsService
  ) { }

  ngOnInit(): void {
    if (!this._gs.haveCrawlData) {
      //debug
      console.log('\x1b[33m test :\x1b[0m');
      this._gs.getInfoData();
    }
  }

  get loading() {
    return this._gs.quan.length == 0;
  }

  get dataQuan() {
    return this._gs.quan;
  }

  get dataPhuong() {
    return this._gs.phuong;
  }

  get dataNguonKH() {
    return this._gs.nguonKH;
  }

  addNewCustomer() {
    this._gs.addCustomer(this.customerForm.value).subscribe(
      res => {
        //debug
        console.log('\x1b[33m res :\x1b[0m', res);
      }
    )
  }
}
