import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-child-layout',
  templateUrl: './child-layout.component.html',
  styleUrls: ['./child-layout.component.scss']
})
export class ChildLayoutComponent implements OnInit {


  type: number = 0;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.type = this.router.url == '/customer' ? 1 : this.type;
    this.type = this.router.url == '/order' ? 2 : this.type;
  }

}
