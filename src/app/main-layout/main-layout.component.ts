import { Component, OnInit } from '@angular/core';
import { GsService } from '../gs.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {


  constructor(
    private _gs: GsService
  ) { }

  ngOnInit(): void {
    if (!this._gs.haveCrawlData) {
      //debug
      console.log('\x1b[33m test :\x1b[0m');
      this._gs.getInfoData();
    } else {
      console.log('\x1b[33m quan :\x1b[0m', this._gs.quan);
    }
  }

}
