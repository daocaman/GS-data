import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GsService } from '../gs.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  type: string = 'new';

  isSubmit = false;

  messages: string = "";

  error: boolean = false;

  _phuong: Array<any> = [];
  _loading = false;

  _refresh: boolean = false;

  edit_idx: any = null;

  fromOrder: boolean = false;

  lenPhone = "";

  customerForm: FormGroup = new FormGroup({
    idKH: new FormControl(""),
    phone: new FormControl("", Validators.required),
    name1: new FormControl("", Validators.required),
    name2: new FormControl("Chị", Validators.required),
    name: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    phuong: new FormControl("", Validators.required),
    quan: new FormControl("", Validators.required),
    nguonKh: new FormControl("", Validators.required),
    gt: new FormControl("Nữ", Validators.required),
  })

  quan = []

  constructor(
    private _gs: GsService,
    private _route: Router
  ) {
    if (this._gs.currentURL) {
      this._gs.previousURL = this._gs.currentURL;
    }
    this._gs.currentURL = this._route.url;

    this.fromOrder = this._gs.previousURL == "/order";
  }

  ngOnInit(): void {
    let ssUser = window.sessionStorage.getItem("user");

    if(!ssUser){
      this._route.navigateByUrl("/login");
    }
    this.messages = "";
    if (!this._gs.haveCrawlData) {
      this._gs.getInfoData();
    }
  }

  backPage() {
    if (this._gs.previousURL) {
      this._route.navigateByUrl(this._gs.previousURL);
    } else {
      this._route.navigateByUrl('/');
    }
  }

  get loading() {
    return this._gs.fee.length == 0;
  }

  get dataQuan() {
    return this._gs.fee;
  }

  get dataPhuong() {
    if (this.customerForm.get("quan")?.value != "") {
      this._phuong = this._gs.fee[this.customerForm.get("quan")?.value]["phuong"];
    }
    return this._phuong;
  }

  set dataPhuong(obj) {
    this._phuong = obj;
  }

  get dataNguonKH() {
    return this._gs.nguonKH;
  }

  resetPhuong() {
    this.customerForm.get("phuong")?.setValue("");
  }

  clearData() {
    this._refresh = true;
    this.type = 'new';
    this.customerForm.reset();
    this.customerForm.patchValue({
      name2: "Chị",
      gt: "Nữ",
      idKH: "Khách hàng mới."
    });
    this._refresh = false;


  }

  addNewCustomer() {

    this.isSubmit = true;
    this.error = false;
    this.messages = "";
    if (this.customerForm.valid) {

      let postData = Object.assign({}, this.customerForm.value);

      let target = Object.assign({}, this._gs.fee[postData["quan"]]);

      postData["quan"] = target.quan;

      if (postData["phuong"] != "i") {
        postData["phuong"] = target.phuong[postData["phuong"]]["name"];
      } else {
        postData["phuong"] = target.phuong[0]["name"];
      }

      this._gs.addCustomer(postData).subscribe(
        (res: any) => {

          this.customerForm.patchValue({ 'idKH': res.data })
          this.messages = "Thêm thành công!";
          if (this.fromOrder) {
            window.localStorage.setItem("newPhone", postData.phone);
          }

          setTimeout(() => {
            this.messages = "";
            if (this.fromOrder) {
              this._route.navigateByUrl("/order");
            } else {
              this._route.navigateByUrl("/");
            }
          }, 1500);

        }
      )

    } else {
      this.messages = "Vui lòng điền đủ các trường.";
      this.error = true;
      this.customerForm.markAllAsTouched();
    }
    this.isSubmit = false;

  }

  get f() {
    return this.customerForm.controls;
  }

  getCustomer() {

    let tmpPhone = this.customerForm.get("phone")?.value;

    tmpPhone = tmpPhone.replace(/\s+/g, '');

    this.lenPhone = tmpPhone.length;

    if (tmpPhone && tmpPhone.length >= 10 && this.type == 'new') {
      this._loading = true;

      this._gs.getCustomer({ phone: tmpPhone }).subscribe(
        (res: any) => {

          this._loading = false;

          if (res.data[0].length == 1) {
            this.type = 'new';
            this.customerForm.reset();
            this.customerForm.patchValue({
              name2: "Chị",
              phone: tmpPhone,
              gt: "Nữ",
              idKH: "Khách hàng mới."
            });
          } else {

            this.type = 'edit';
            let tmpQuan = this._gs.fee.findIndex(e => e.quan == res.data[0][7]);

            let tmpPhuong = this._gs.fee[tmpQuan].phuong.findIndex((e: any) => e.name == res.data[0][6]);

            this.dataPhuong = this._gs.fee[tmpQuan]["phuong"];

            this.customerForm.patchValue({
              idKH: res.data[0][0],
              phone: res.data[0][1],
              name1: res.data[0][2],
              name2: res.data[0][3],
              name: res.data[0][4],
              address: res.data[0][5],
              phuong: tmpPhuong,
              quan: tmpQuan,
              nguonKh: res.data[0][8],
              gt: res.data[0][9],
            });

            this.edit_idx = res.data[0][10];
          }

        }
      )
    }
  }

  editCustomer() {
    this.isSubmit = true;
    this.error = false;
    this.messages = "";
    if (this.customerForm.valid) {
      let postData = Object.assign({}, this.customerForm.value);

      let target = Object.assign({}, this._gs.fee[postData["quan"]]);

      postData["quan"] = target.quan;

      if (postData["phuong"] != "i") {
        postData["phuong"] = target.phuong[postData["phuong"]]["name"];
      } else {
        postData["phuong"] = target.phuong[0]["name"];
      }

      postData = { ...postData, ...{ customerIdx: this.edit_idx } };

      this._gs.editCustomer(postData).subscribe(
        (res: any) => {
          this.isSubmit = false;
          this.messages = "Cập nhật thành công!";
          setTimeout(() => { this.messages = ""; this._route.navigateByUrl("/"); }, 1500);
        }
      )
    } else {
      this.messages = "Vui lòng điền đủ các trường.";
      this.error = true;
      this.customerForm.markAllAsTouched();
    }
  }

  getIndex(quan: any, phuong: any) {
    let result = {
      quan: 0,
      phuong: 0
    };

    result.quan = this._gs.fee.findIndex(e => e.quan == quan);

    result.phuong = this._gs.fee[this._gs.fee.findIndex(e => e.quan == quan)].phuong.findIndex((e: any) => e == phuong);

    return result;
  }
}
