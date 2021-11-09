import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GsService {

  haveCrawlData = false;

  isRefreshData = false;

  tp: Array<any> = [];

  fee: Array<any> = [];

  nguonKH = [];
  kethon = [];
  tuoi = [];
  sale = [];
  thanhToan = [];

  kvShip: Array<any> = [];

  size: Array<any> = [];
  doiTuong: Array<any> = [];
  khuon: Array<any> = [];

  nhom: Array<any> = [];

  lop1: Array<any> = [];
  lop2: Array<any> = [];
  lop3: Array<any> = [];

  idSPs: Array<any> = [];
  dataPK: Array<any> = [];

  PERIOD_TIME = 4;

  previousURL = "";

  currentURL = "";

  deploy_key = "AKfycbxoJBo6RIbGliRTaHcVYq2KzpiMZsCOvPMwHewLPabyoeQg6ReFKbrmkdvrUKmm9OkVxA";

  constructor(
    private _api: ApiService,
    private _route: Router
  ) { }

  getInfoData() {

    let ssUser = window.sessionStorage.getItem("user");

    if(!ssUser){
      this._route.navigateByUrl("/login");
    }

    this.haveCrawlData = true;

    let lastSaved = window.localStorage.getItem("GS_saved");

    if (lastSaved) {
      let last_date = new Date(parseInt(lastSaved));
      let now = new Date();
      let diff = Math.abs(now.getTime() - last_date.getTime());
      let diff_hour = Math.ceil(diff / (1000 * 60 * 60));

      if (diff_hour >= 3) {
        this.getDataAPI();
      } else {
        this.getDataLocalStorage();
      }

    } else {
      this.getDataAPI();
    }

  }

  getDataLocalStorage() {
    let tmp_fee = window.localStorage.getItem('fee');
    this.fee = tmp_fee ? JSON.parse(tmp_fee) : [];

    let tmp_nguonKH = window.localStorage.getItem('nguonKH');
    this.nguonKH = tmp_nguonKH ? JSON.parse(tmp_nguonKH) : [];

    let tmp_sale = window.localStorage.getItem('sale');
    this.sale = tmp_sale ? JSON.parse(tmp_sale) : [];

    let tmp_thanhToan = window.localStorage.getItem('thanhToan');
    this.thanhToan = tmp_thanhToan ? JSON.parse(tmp_thanhToan) : [];

    let tmp_kethon = window.localStorage.getItem('kethon');
    this.kethon = tmp_kethon ? JSON.parse(tmp_kethon) : [];

    let tmp_tuoi = window.localStorage.getItem('tuoi');
    this.tuoi = tmp_tuoi ? JSON.parse(tmp_tuoi) : [];

    let tmp_tp = window.localStorage.getItem('tp');
    this.tp = tmp_tp ? JSON.parse(tmp_tp) : [];

    let tmp_size = window.localStorage.getItem('size');
    this.size = tmp_size ? JSON.parse(tmp_size) : [];

    let tmp_doiTuong = window.localStorage.getItem('doiTuong');
    this.doiTuong = tmp_doiTuong ? JSON.parse(tmp_doiTuong) : [];

    let tmp_khuon = window.localStorage.getItem('khuon');
    this.khuon = tmp_khuon ? JSON.parse(tmp_khuon) : [];

    let tmp_nhom = window.localStorage.getItem('nhom');
    this.nhom = tmp_nhom ? JSON.parse(tmp_nhom) : [];

    let tmp_lop1 = window.localStorage.getItem('lop1');
    this.lop1 = tmp_lop1 ? JSON.parse(tmp_lop1) : [];

    let tmp_lop2 = window.localStorage.getItem('lop2');
    this.lop2 = tmp_lop2 ? JSON.parse(tmp_lop2) : [];

    let tmp_lop3 = window.localStorage.getItem('lop3');
    this.lop3 = tmp_lop3 ? JSON.parse(tmp_lop3) : [];

    let tmp_idSPs = window.localStorage.getItem('idSPs');
    this.idSPs = tmp_idSPs ? JSON.parse(tmp_idSPs) : [];

    let tmp_dataPK = window.localStorage.getItem('dataPK');
    this.dataPK = tmp_dataPK ? JSON.parse(tmp_dataPK) : [];

  }

  getDataAPI() {

    this._api.get(this.deploy_key, 'exec', { data: 'info' }).subscribe
      ((res: any) => {

        this.haveCrawlData = true;

        for (let i = 0; i < res.data.dataShipFee.length; i++) {
          if (res.data.dataShipFee[i][0]) {

            if (this.fee.length == 0) {
              this.fee.push({ "quan": res.data.dataShipFee[i][0], "phuong": [{ "name": res.data.dataShipFee[i][1], fee: res.data.dataShipFee[i][2] }] });
            } else {
              if (this.fee[this.fee.length - 1]["quan"] == res.data.dataShipFee[i][0]) {
                this.fee[this.fee.length - 1]["phuong"].push({ "name": res.data.dataShipFee[i][1], fee: res.data.dataShipFee[i][2] });
              } else {
                this.fee.push({ "quan": res.data.dataShipFee[i][0], "phuong": [{ "name": res.data.dataShipFee[i][1], fee: res.data.dataShipFee[i][2] }] });
              }
            }

            window.localStorage.setItem("fee", JSON.stringify(this.fee));
          }
        }

        this.nguonKH = res.data.dataNguonKH.map((e: Array<any>) => { return e[0] });
        window.localStorage.setItem("nguonKH", JSON.stringify(this.nguonKH));

        this.sale = res.data.dataSales.map((e: Array<any>) => { return e[0] });
        window.localStorage.setItem("sale", JSON.stringify(this.sale));

        this.thanhToan = res.data.dataThanhToan.map((e: Array<any>) => { return e[0] });
        window.localStorage.setItem("thanhToan", JSON.stringify(this.thanhToan));

        this.kethon = res.data.dataTTKetHon.map((e: Array<any>) => { return e[0] });
        window.localStorage.setItem("kethon", JSON.stringify(this.kethon));

        this.tuoi = res.data.dataTuoi.map((e: Array<any>) => { return e[0] });
        window.localStorage.setItem("tuoi", JSON.stringify(this.tuoi));

        for (let i = 0; i < res.data.dataTp.length; i++) {
          if (res.data.dataTp[i][1]) {
            this.tp.push({ id: res.data.dataTp[i][0], value: res.data.dataTp[i][1] });
          }
        }
        window.localStorage.setItem("tp", JSON.stringify(this.tp));

        for (let i = 0; i < res.data.dataSize.length; i++) {
          if (res.data.dataSize[i][1]) {
            this.size.push({ id: res.data.dataSize[i][0], value: res.data.dataSize[i][1] });
          }
        }
        window.localStorage.setItem("size", JSON.stringify(this.size));


        for (let i = 0; i < res.data.dataDoiTuong.length; i++) {
          if (res.data.dataDoiTuong[i][1]) {
            this.doiTuong.push({ id: res.data.dataDoiTuong[i][0], value: res.data.dataDoiTuong[i][1] });
          }
        }
        window.localStorage.setItem("doiTuong", JSON.stringify(this.doiTuong));


        for (let i = 0; i < res.data.dataKhuon.length; i++) {
          if (res.data.dataKhuon[i][1]) {
            this.khuon.push({ id: res.data.dataKhuon[i][0], value: res.data.dataKhuon[i][1] });
          }
        }
        window.localStorage.setItem("khuon", JSON.stringify(this.khuon));

        for (let i = 0; i < res.data.dataNhom.length; i++) {
          if (res.data.dataNhom[i][1]) {
            this.nhom.push({ id: res.data.dataNhom[i][0], value: res.data.dataNhom[i][1] });
          }
        }
        window.localStorage.setItem("nhom", JSON.stringify(this.nhom));

        for (let i = 0; i < res.data.dataLop.length; i++) {
          if (res.data.dataLop[i][0]) {
            let tmp = res.data.dataLop[i][0].toLowerCase();
            tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
            this.lop1.push(tmp);
          }
          if (res.data.dataLop[i][1]) {
            let tmp = res.data.dataLop[i][0].toLowerCase();
            tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
            this.lop2.push(tmp);
          }
          if (res.data.dataLop[i][2]) {
            let tmp = res.data.dataLop[i][0].toLowerCase();
            tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
            this.lop3.push(tmp);
          }

        }
        window.localStorage.setItem("lop1", JSON.stringify(this.lop1));
        window.localStorage.setItem("lop2", JSON.stringify(this.lop2));
        window.localStorage.setItem("lop3", JSON.stringify(this.lop3));

        for (let i = 0; i < res.data.idSP.length; i++) {
          if (res.data.idSP[i][0] != "") {
            this.idSPs.push({ row: i + 2, value: res.data.idSP[i][0] });
          }
        }
        window.localStorage.setItem("idSPs", JSON.stringify(this.idSPs));

        for (let i = 0; i < res.data.dataPK.length; i++) {
          if (res.data.dataPK[i][0] != "") {
            this.dataPK.push({ key: res.data.dataPK[i][0], value: res.data.dataPK[i][res.data.dataPK[i].length - 1] });
          }
        }
        window.localStorage.setItem("dataPK", JSON.stringify(this.dataPK));

        window.localStorage.setItem("GS_saved", (new Date()).getTime().toString());

      });
  }

  addCustomer(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "add-customer", ...data });
  }

  addOrder(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "add-order", ...data });
  }

  cancelOrder(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "cancel-order", ...data });
  }

  getCustomer(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "get-customer", ...data });
  }

  getSP(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "get-sp", ...data });
  }

  getOrder(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "get-order", ...data });
  }

  editCustomer(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "edit-customer", ...data });
  }

  editOrder(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: "edit-order", ...data });
  }

  login(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: 'login', ...data });
  }

}
