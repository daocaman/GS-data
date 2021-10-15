import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GsService {

  haveCrawlData = false;

  tp: Array<any> = [];
  quan = [];
  phuong = [];

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

  deploy_key = "AKfycbwnvQ8D5C04xFUaBuvdBM31-_gAZrO92CdlTko-cfy79S6czubE2dQYWYymBoQUKPj1iQ";

  constructor(
    private _api: ApiService
  ) { }


  getInfoData() {
    this._api.get(this.deploy_key, 'exec', { data: 'info' }).subscribe
      ((res: any) => {
        this.haveCrawlData = true;
        this.quan = res.data.dataQuan.map((e: Array<any>) => { return e[0] });
        this.nguonKH = res.data.dataNguonKH.map((e: Array<any>) => { return e[0] });
        this.sale = res.data.dataSales.map((e: Array<any>) => { return e[0] });
        this.thanhToan = res.data.dataThanhToan.map((e: Array<any>) => { return e[0] });
        this.kethon = res.data.dataTTKetHon.map((e: Array<any>) => { return e[0] });
        this.tuoi = res.data.dataTuoi.map((e: Array<any>) => { return e[0] });

        for (let i = 0; i < res.data.dataTp.length; i++) {
          if (res.data.dataTp[i][1]) {
            this.tp.push({ id: res.data.dataTp[i][0], value: res.data.dataTp[i][1] });
          }
        }

        for (let i = 0; i < res.data.dataKhuVucShip.length; i++) {
          if (res.data.dataKhuVucShip[i][1]) {
            this.kvShip.push({ id: res.data.dataKhuVucShip[i][0], value: res.data.dataKhuVucShip[i][1] });
          }
        }

        for (let i = 0; i < res.data.dataSize.length; i++) {
          if (res.data.dataSize[i][1]) {
            this.size.push({ id: res.data.dataSize[i][0], value: res.data.dataSize[i][1] });
          }
        }

        for (let i = 0; i < res.data.dataDoiTuong.length; i++) {
          if (res.data.dataDoiTuong[i][1]) {
            this.doiTuong.push({ id: res.data.dataDoiTuong[i][0], value: res.data.dataDoiTuong[i][1] });
          }
        }

        for (let i = 0; i < res.data.dataKhuon.length; i++) {
          if (res.data.dataKhuon[i][1]) {
            this.khuon.push({ id: res.data.dataKhuon[i][0], value: res.data.dataKhuon[i][1] });
          }
        }

        for (let i = 0; i < res.data.dataNhom.length; i++) {
          if (res.data.dataNhom[i][1]) {
            this.nhom.push({ id: res.data.dataNhom[i][0], value: res.data.dataNhom[i][1] });
          }
        }

      });
  }

  addCustomer(data: any) {
    return this._api.get(this.deploy_key, 'exec', { data: 'add-customer', ...data });
  }





}
