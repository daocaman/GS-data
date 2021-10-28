import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GsService } from '../gs.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private _gs: GsService,
    private _route: Router
  ) {
    if (this._gs.currentURL) {
      this._gs.previousURL = this._gs.currentURL;
    }
    this._gs.currentURL = this._route.url;
  }

  ngOnInit(): void {

    if (!this._gs.haveCrawlData) {
      this._gs.getInfoData();
    }
  }

}
