import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GsService } from '../gs.service';
import { formatDate } from '@angular/common';
import { SanPham } from '../san-pham';
import { NavigationEnd, Router } from '@angular/router';
import { DialogService } from '../dialog.service';
import { HoaDonComponent } from '../hoa-don/hoa-don.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  nowDate = new Date();

  hours = "5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21".split(" ");

  crrSP: SanPham;

  loadingSP: boolean = false;
  messagesSP: string = '';

  loadingCustomer: boolean = false;
  messageCustomer: string = '';

  orderMessages: string = '';

  editOrderId: any = null;

  statusDH = "";

  orderForm: FormGroup = new FormGroup({
    isEdit: new FormControl(false),
    maDH: new FormControl(''),
    sale: new FormControl('', Validators.required),
    orderDate: new FormControl(formatDate(this.nowDate, "YYYY-MM-dd", 'en'), Validators.required),
    receivedDate: new FormControl('', Validators.required),
    maSP: new FormControl('', Validators.required),
    nhom: new FormControl(''),
    size: new FormControl('', Validators.required),
    khuon: new FormControl(''),
    lop1: new FormControl(''),
    lop2: new FormControl(''),
    lop3: new FormControl(''),
    doiTuong: new FormControl('', Validators.required),
    dgSP: new FormControl('', Validators.required),
    numSP: new FormControl('', Validators.required),
    contentSP: new FormControl(''),
    noteSP: new FormControl(''),
    flan: new FormControl(''),
    phomai: new FormControl(''),
    anh: new FormControl(''),
    nen: new FormControl(''),
    muong: new FormControl(''),
    phao: new FormControl(''),
    non: new FormControl(''),
    bich: new FormControl(''),
    sumPK: new FormControl(''),
    phone: new FormControl('', Validators.required),
    name1: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    feeShip: new FormControl(''),
    address: new FormControl('', Validators.required),
    quan: new FormControl('', Validators.required),
    phuong: new FormControl('', Validators.required),
    nguonKH: new FormControl(''),
    gioGiao: new FormControl('', Validators.required),
    phutGiao: new FormControl(null, Validators.required),
    noteGH: new FormControl(''),
    tongTien: new FormControl('', Validators.required),
    VAT: new FormControl(''),
    giam: new FormControl(''),
    thanhTien: new FormControl('', Validators.required),
    htThanhToan: new FormControl('Tiền mặt', Validators.required),
    isPaid: new FormControl(false, Validators.required),
    noteDH: new FormControl('')
  })

  @Input() type: string = "new";

  _loading: boolean = false;

  _phuong: Array<any> = [];

  isSubmit: boolean = false;

  messages: string = "";

  error: boolean = false;

  previousUrl: string = "";

  constructor(
    private _gs: GsService,
    private _currency: CurrencyPipe,
    private _route: Router,
    private _dialog: DialogService
  ) {
    if (this._gs.currentURL) {
      this._gs.previousURL = this._gs.currentURL;
    }
    this._gs.currentURL = this._route.url;

  }

  ngOnInit(): void {

    this.messageCustomer = "";
    this.messages = "";
    this.orderMessages = "";
    this.messagesSP = "";
    if (!this._gs.haveCrawlData) {
      this._gs.getInfoData();
    }
    if (window.localStorage.getItem("formOrder")) {

      let tmpFormValue = window.localStorage.getItem("formOrder");

      let newPhone = window.localStorage.getItem("newPhone");
      if (tmpFormValue) {
        let tmpForm = JSON.parse(tmpFormValue);
        if (tmpFormValue) {
          this.orderForm.patchValue(
            tmpForm
          );
          if (newPhone) {
            this.orderForm.patchValue({ phone: newPhone });
            this.getCustomer();
            window.localStorage.removeItem("newPhone");
          }
          this.getSP(false);

          window.localStorage.removeItem("formOrder");
        }
      }

    }
  }

  addCustomer() {
    let tmp = Object.assign({}, this.orderForm.value);
    window.localStorage.setItem("formOrder", JSON.stringify(tmp));
    this._route.navigateByUrl('/customer');
  }

  applyFormat(control: any) {
    let tmp = this.orderForm.get(control)?.value;
    tmp = tmp.replaceAll(",", "");
    tmp = parseInt(tmp);
    this.orderForm.get(control)?.setValue(this._currency.transform(tmp, 'VND', ''));
    this.caculateVat();
    this.caculateMoney();
  }

  backPage() {
    // if (this._gs.previousURL) {
    //   this._route.navigateByUrl(this._gs.previousURL);
    // } else {
    this._route.navigateByUrl('/');
    // }
  }

  caculateVat() {

    let checkVat = document.getElementById("checkVAT") as HTMLInputElement;

    if (checkVat.checked) {

      let tmpForm = Object.assign({}, this.orderForm.value);

      let dg = (tmpForm.dgSP == "") ? 0 : parseInt(tmpForm.dgSP.replaceAll(",", ""));
      let sl = (tmpForm.numSP == null) ? 1 : tmpForm.numSP;

      let sumSP = dg * sl;

      let pk = (tmpForm.sumPK == "" || tmpForm.sumPK == null) ? 0 : parseInt(tmpForm.sumPK.replaceAll(",", ""));

      let fee = (tmpForm.feeShip == "" || tmpForm.feeShip == null) ? 0 : parseInt(tmpForm.feeShip.replaceAll(",", ""));

      let giam = (tmpForm.giam == "" || tmpForm.giam == null) ? 0 : parseInt(tmpForm.giam.replaceAll(",", ""));

      let tongTien = sumSP + pk + fee;

      let vat = (tongTien - giam) * 0.1;

      this.orderForm.patchValue({
        VAT: this._currency.transform(vat, 'VND', '')
      })

    } else {
      this.orderForm.patchValue({
        VAT: ""
      })
    }
    this.caculateMoney();

  }

  caculatePK() {
    let tmp = Object.assign({}, this.orderForm.value);

    let sum = 0;
    if (tmp.flan) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'Flan'.toLowerCase() });
      sum += pk.value * parseInt(tmp.flan);
    }

    if (tmp.phomai) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'phomai'.toLowerCase() });
      sum += pk.value * parseInt(tmp.phomai);
    }

    if (tmp.muong) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'muỗng dĩa'.toLowerCase() });
      sum += pk.value * parseInt(tmp.muong);
    }

    if (tmp.anh) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'in ảnh'.toLowerCase() });
      sum += pk.value * parseInt(tmp.anh);
    }

    if (tmp.phao) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'pháo sáng'.toLowerCase() });
      sum += pk.value * parseInt(tmp.phao);
    }

    if (tmp.non) {
      let pk = this._gs.dataPK.find((e) => { return e.key.toLowerCase() == 'nón'.toLowerCase() });
      sum += pk.value * parseInt(tmp.non);
    }

    this.orderForm.patchValue({ sumPK: this._currency.transform(sum, 'VND', '') })

    this.caculateVat();

    this.caculateMoney();

  }

  caculateMoney() {
    let tmpForm = Object.assign({}, this.orderForm.value);

    let dg = (tmpForm.dgSP == "") ? 0 : parseInt(tmpForm.dgSP.replaceAll(",", ""));
    let sl = (tmpForm.numSP == null) ? 1 : tmpForm.numSP;

    let sumSP = dg * sl;

    let pk = (tmpForm.sumPK == "" || tmpForm.sumPK == null) ? 0 : parseInt(tmpForm.sumPK.replaceAll(",", ""));

    let fee = (tmpForm.feeShip == "" || tmpForm.feeShip == null) ? 0 : parseInt(tmpForm.feeShip.replaceAll(",", ""));

    let vat = (tmpForm.VAT == "" || tmpForm.VAT == null) ? 0 : parseInt(tmpForm.VAT.replaceAll(",", ""));

    let giam = (tmpForm.giam == "" || tmpForm.giam == null) ? 0 : parseInt(tmpForm.giam.replaceAll(",", ""));

    let tongTien = sumSP + pk + fee;
    let thanhTien = tongTien + vat - giam;

    this.orderForm.patchValue({
      thanhTien: this._currency.transform(thanhTien, "VND", ""),
      tongTien: this._currency.transform(tongTien, "VND", "")
    })

  }

  cancelOrder() {
    this.isSubmit = true;
    this.error = false;
    this.messages = "";
    this._gs.cancelOrder({ orderIdx: this.editOrderId }).subscribe(
      res => {
        this.isSubmit = false;
        this.messages = "Hủy đơn hàng thành công.";
        setTimeout(() => { this.messages = ""; this._route.navigateByUrl("/") }, 1500);
      }
    )
  }

  get DoituongData() {
    return this._gs.doiTuong;
  }

  getDH() {
    this.statusDH = "";
    let formVal = Object.assign({}, this.orderForm.value);
    this.orderMessages = "";

    this._loading = true;
    if (formVal.maDH.length == 8) {
      this._gs.getOrder({ maDH: formVal.maDH }).subscribe(
        (res: any) => {
          if (res.data[0].length == 1) {
            this.orderMessages = "Không tìm thấy đơn hàng!";
          } else {

            this.statusDH = res.data[0][1];
            let tmpQuan = this._gs.fee.findIndex(e => e.quan == res.data[0][29]);

            let tmpPhuong = this._gs.fee[tmpQuan].phuong.findIndex((e: any) => e.name == res.data[0][28]);

            this._phuong = this._gs.fee[tmpQuan]["phuong"];

            if (res.data[0][37] && document.getElementById("checkVAT") != null) {
              let ele = document.getElementById("checkVAT") as HTMLInputElement;
              if (ele) {
                ele.checked = true;
              }
            }

            this.orderForm.patchValue({
              sale: res.data[0][0],
              orderDate: formatDate(res.data[0][3], "YYYY-MM-dd", "en"),
              receivedDate: formatDate(res.data[0][5], "YYYY-MM-dd", "en"),
              nhom: res.data[0][6],
              maSP: res.data[0][7],
              lop1: res.data[0][8],
              lop2: res.data[0][9],
              lop3: res.data[0][10],
              size: res.data[0][11],
              khuon: res.data[0][12],
              contentSP: res.data[0][13],
              doiTuong: res.data[0][14],
              flan: res.data[0][15],
              phomai: res.data[0][16],
              anh: res.data[0][17],
              nen: res.data[0][18],
              muong: res.data[0][19],
              phao: res.data[0][20],
              non: res.data[0][21],
              bich: res.data[0][22],
              noteSP: res.data[0][23],
              name1: res.data[0][24],
              phone: res.data[0][25],
              name: res.data[0][26],
              address: res.data[0][27],
              phuong: tmpPhuong,
              quan: tmpQuan,
              gioGiao: res.data[0][31].split("g")[0],
              phutGiao: res.data[0][31].split("g")[1] ? res.data[0][31].split("g")[1] : "00",
              noteGH: res.data[0][32],
              feeShip: this._currency.transform(res.data[0][33], "VND", ""),
              numSP: res.data[0][34],
              dgSP: this._currency.transform(res.data[0][35], 'VND', ''),
              sumPK: this._currency.transform(res.data[0][36], 'VND', ""),
              VAT: this._currency.transform(res.data[0][37], 'VND', ""),
              giam: this._currency.transform(res.data[0][38], 'VND', ""),
              htThanhToan: res.data[0][40],
              isPaid: res.data[0][41] == "Rồi",
              nguonKH: res.data[0][42],
              noteDH: res.data[0][43]
            })
          }
          this.editOrderId = res.data[0][44];
          this.getSP(false);
          this._loading = false;
          this.caculateMoney();
        }
      )
    } else {
      this._loading = false;
    }

  }

  get isEdit() {
    return this.orderForm.get("isEdit")?.value == true;
  }

  get f() {
    return this.orderForm.controls;
  }

  get HTTTData() {
    return this._gs.thanhToan;
  }

  get IDSPsData() {
    return this._gs.idSPs;
  }

  get KhuonData() {
    return this._gs.khuon;
  }

  get Lop1Data() {
    return this._gs.lop1;
  }

  get Lop2Data() {
    return this._gs.lop2;
  }

  get Lop3Data() {
    return this._gs.lop3;
  }

  get loading() {
    return this._gs.fee.length == 0;
  }

  get SalesData() {
    return this._gs.sale;
  }

  getShip() {

    if (this.orderForm.get('quan')?.value && this.orderForm.get('phuong')?.value) {
      this.orderForm.patchValue({
        feeShip: this._currency.transform(this._gs.fee[this.orderForm.get('quan')?.value].phuong[this.orderForm.get('phuong')?.value].fee, "VND", "")
      });
      this.caculateVat();
      this.caculateMoney();
    }
  }

  get SizeData() {
    return this._gs.size;
  }

  get QuanData() {
    return this._gs.fee;
  }

  get PhuongData() {
    if (this.orderForm.get("quan")?.value != "") {
      this._phuong = this._gs.fee[this.orderForm.get("quan")?.value]["phuong"];
    }
    return this._phuong;
  }

  findRowSP(idSP: any) {
    let idx = this._gs.idSPs.findIndex((e: any) => { return e.value == idSP; })

    if (idx != -1) {
      let rowSP = this._gs.idSPs[idx]["row"];

      return rowSP;
    }

    return -1;

  }

  getCustomer() {
    this.messageCustomer = "";
    let tmpPhone = this.orderForm.get("phone")?.value;
    if (tmpPhone && tmpPhone.length >= 10) {
      this.loadingCustomer = true;
      this._gs.getCustomer({ phone: tmpPhone }).subscribe(
        (res: any) => {
          this.loadingCustomer = false;

          if (res.data[0].length == 1) {
            this.messageCustomer = "Khách hàng chưa có trong hệ thống!"
          } else {
            let tmpQuan = this._gs.fee.findIndex(e => e.quan == res.data[0][7]);

            let tmpPhuong = this._gs.fee[tmpQuan].phuong.findIndex((e: any) => e.name == res.data[0][6]);

            let fee = this._gs.fee[tmpQuan].phuong[tmpPhuong].fee;

            this._phuong = this._gs.fee[tmpQuan]["phuong"];
            this.orderForm.patchValue({
              phone: res.data[0][1],
              name1: res.data[0][2],
              name: res.data[0][3].trim() + ' ' + res.data[0][4].trim(),
              address: res.data[0][5],
              nguonKH: res.data[0][8],
              phuong: tmpPhuong,
              quan: tmpQuan,
              feeShip: this._currency.transform(fee, 'VND', '')
            })

            this.caculateMoney();
          }

        }
      )
    }

  }

  getDgSP() {
    let tmpSize = this.orderForm.get('size')?.value;

    let tmpDg = this.crrSP.price(tmpSize);

    this.orderForm.patchValue({
      dgSP: this._currency.transform(tmpDg, 'VND', '')
    });

    this.caculateVat();
    this.caculateMoney();
  }

  getSP(patchValue: boolean = true) {

    this.messagesSP = "";

    let rowSP = this.findRowSP(this.orderForm.value["maSP"]);

    this.loadingSP = true;
    if (rowSP != -1) {
      this._gs.getSP({ row: rowSP }).subscribe(
        (res: any) => {
          this.crrSP = new SanPham(res.data[0]);

          //debug
          console.log('\x1b[33m this.crrSP :\x1b[0m', this.crrSP);

          if (patchValue) {

            this.orderForm.patchValue({
              khuon: this.crrSP.khuon,
              nhom: this.crrSP.nhom,
              size: this.crrSP.defaultSize,
              lop1: this.crrSP.lop1,
              lop2: this.crrSP.lop2,
              lop3: this.crrSP.lop3,
              dgSP: this._currency.transform(this.crrSP.defaultPrice, 'VND', ''),
              numSP: 1
            });

          }
          this.caculateMoney();
          this.loadingSP = false;
        },
        (err) => {
          this.messagesSP = "Lỗi API!";
        }
      )
    } else {
      this.loadingSP = false;
      this.messagesSP = "Mã sản phẩm không phù hợp!";
    }

  }

  addOrder() {

    this.isSubmit = true;
    this.messages = "";
    this.error = false;

    if (this.orderForm.valid) {
      let dataForm = Object.assign({}, this.orderForm.value);

      let postData = {
        sale: dataForm.sale,
        orderDate: formatDate(dataForm.orderDate, "dd/MM/yyyy", 'en'),
        receivedDate: formatDate(dataForm.receivedDate, "dd/MM/yyyy", 'en'),
        nhom: dataForm.nhom,
        maSP: dataForm.maSP,
        lop1: dataForm.lop1,
        lop2: dataForm.lop2,
        lop3: dataForm.lop3,
        size: parseInt(dataForm.size),
        khuon: dataForm.khuon,
        contentSP: dataForm.contentSP,
        doiTuong: dataForm.doiTuong,
        flan: dataForm.flan,
        phomai: dataForm.phomai,
        anh: dataForm.anh,
        nen: dataForm.nen,
        muong: dataForm.muong,
        phao: dataForm.phao,
        non: dataForm.non,
        bich: dataForm.bich,
        noteSP: dataForm.noteSP,
        name1: dataForm.name1,
        phone: dataForm.phone,
        name: dataForm.name,
        address: dataForm.address,
        phuong: this._gs.fee[dataForm.quan].phuong[dataForm.phuong].name,
        quan: this._gs.fee[dataForm.quan].quan,
        gioGiao: dataForm.gioGiao + "g" + (dataForm.phutGiao == "00" ? "" : "30"),
        noteGH: dataForm.noteGH,
        feeShip: parseInt(dataForm.feeShip.replaceAll(",", "")),
        numSP: dataForm.numSP,
        dgSP: dataForm.dgSP ? parseInt(dataForm.dgSP.replaceAll(",", "")) : "",
        sumPK: parseInt(dataForm.sumPK.replaceAll(",", "")),
        VAT: dataForm.VAT ? parseInt(dataForm.VAT.replaceAll(",", "")) : "",
        giam: dataForm.giam ? parseInt(dataForm.giam.replaceAll(",", "")) : "",
        thanhTien: parseInt(dataForm.thanhTien.replaceAll(",", "")),
        htThanhToan: dataForm.htThanhToan,
        isPaid: dataForm.isPaid ? 'Rồi' : 'Chưa',
        nguonKH: dataForm.nguonKH,
        noteDH: dataForm.noteDH
      }

      // this._dialog.openModal(HoaDonComponent, {
      //   initialState: {
      //     value: postData,
      //     callBack: () => { this.messages = "Thêm đơn thành công"; setTimeout(() => { this._route.navigateByUrl("/") }, 1500) }
      //   },
      //   class: 'modal-lg',
      //   ignoreBackdropClick: true
      // });

            
      this.orderForm.patchValue({isEdit: true});


      this._gs.addOrder(postData).subscribe(
        (res: any) => {
          this.orderForm.patchValue({
            maDH: res.data
          })
          postData = { ...{ maDH: res.data }, ...postData }
          this.isSubmit = false;

          this._dialog.openModal(HoaDonComponent, {
            initialState: {
              value: postData,
              submitCall: () => { this.messages = "Thêm đơn thành công"; setTimeout(() => { this._route.navigateByUrl("/") }, 1500) },
            },
            class: 'modal-lg',
            ignoreBackdropClick: true
          });

        }
      )

    } else {
      this.isSubmit = false;
      this.orderForm.markAllAsTouched();
      this.messages = "Vui lòng điền đầy đủ các trường."
      this.error = true;
    }
  }

  editOrder() {
    this.isSubmit = true;
    this.messages = "";
    if (this.orderForm.valid) {
      let dataForm = Object.assign({}, this.orderForm.value);
      let postData = {
        maDH: dataForm.maDH,
        sale: dataForm.sale,
        orderDate: formatDate(dataForm.orderDate, "dd/MM/yyyy", 'en'),
        receivedDate: formatDate(dataForm.receivedDate, "dd/MM/yyyy", 'en'),
        nhom: dataForm.nhom,
        maSP: dataForm.maSP,
        lop1: dataForm.lop1,
        lop2: dataForm.lop2,
        lop3: dataForm.lop3,
        size: parseInt(dataForm.size),
        khuon: dataForm.khuon,
        contentSP: dataForm.contentSP,
        doiTuong: dataForm.doiTuong,
        flan: dataForm.flan,
        phomai: dataForm.phomai,
        anh: dataForm.anh,
        nen: dataForm.nen,
        muong: dataForm.muong,
        phao: dataForm.phao,
        non: dataForm.non,
        bich: dataForm.bich,
        noteSP: dataForm.noteSP,
        name1: dataForm.name1,
        phone: dataForm.phone,
        name: dataForm.name,
        address: dataForm.address,
        phuong: this._gs.fee[dataForm.quan].phuong[dataForm.phuong].name,
        quan: this._gs.fee[dataForm.quan].quan,
        gioGiao: dataForm.gioGiao + "g" + (dataForm.phutGiao == "00" ? "" : "30"),
        noteGH: dataForm.noteGH,
        feeShip: parseInt(dataForm.feeShip.replaceAll(",", "")),
        numSP: dataForm.numSP,
        dgSP: parseInt(dataForm.dgSP.replaceAll(",", "")),
        sumPK: parseInt(dataForm.sumPK.replaceAll(",", "")),
        VAT: dataForm.VAT ? parseInt(dataForm.VAT.replaceAll(",", "")) : "",
        giam: dataForm.giam ? parseInt(dataForm.giam.replaceAll(",", "")) : "",
        thanhTien: parseInt(dataForm.thanhTien.replaceAll(",", "")),
        htThanhToan: dataForm.htThanhToan,
        isPaid: dataForm.isPaid ? 'Rồi' : 'Chưa',
        nguonKH: dataForm.nguonKH,
        noteDH: dataForm.noteDH,
        orderIdx: this.editOrderId
      }

      // this._dialog.openModal(HoaDonComponent, {
      //   initialState: {
      //     value: postData,
      //     callBack: () => { this.messages = "Cập nhật đơn thành công"; setTimeout(() => { this._route.navigateByUrl("/") }, 1500) }
      //   },
      //   class: 'modal-lg',
      //   ignoreBackdropClick: true
      // });


      this._gs.editOrder(postData).subscribe(
        (res) => {

          this._dialog.openModal(HoaDonComponent, {
            initialState: {
              value: postData,
              submitCall: () => { this.messages = "Cập nhật đơn thành công"; setTimeout(() => { this._route.navigateByUrl("/") }, 1500) }
            },
            class: 'modal-lg',
            ignoreBackdropClick: true
          });

        }
      )

    } else {
      this.messages = "Vui lòng điền đầy đủ các trường.";
    }
    this.isSubmit = false;
  }

  resetForm() {
    if (this.orderForm.get("isEdit")?.value == false) {
      this.orderForm.reset();
      this.orderForm.patchValue({
        isEdit: false,
        orderDate: formatDate(this.nowDate, "YYYY-MM-dd", 'en'),
        quan: "",
        phuong: "",
        htThanhToan: "Tiền mặt"
      });
    }
  }
}
