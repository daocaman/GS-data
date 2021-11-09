import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GsService } from '../gs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  messages: string = "";

  constructor(
    private _gs: GsService,
    private _route: Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.messages = "";
    console.log('\x1b[33m value :\x1b[0m',this.loginForm.value);
    if(this.loginForm.valid){

      this._gs.login(this.loginForm.value).subscribe(
        (res:any)=>{
          if(res.messages != "Email/Password không khớp!"){
            window.sessionStorage.setItem("user", this.loginForm.value.username);
            this._route.navigateByUrl("");
          }else{
            this.messages = res.messages;
          }
        }
      )
    }else{
      this.loginForm.markAllAsTouched();
    }
  }

  get f(){
    return this.loginForm.controls;
  }

}
