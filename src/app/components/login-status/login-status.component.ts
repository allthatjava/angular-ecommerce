import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
// import { OktaAuth } from '@okta/okta-auth-js';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit{

  isAuthenticated: boolean = false;
  userInfo: any;
  userName: string = '';

  storage:Storage = sessionStorage;

  constructor(private oauthService: OAuthService, private route:ActivatedRoute, private authService: AuthService){
  }

  ngOnInit(): void {
    // this.oktaAuthService.authState$.subscribe(
    //   (result => {
    //     this.isAuthenticated = result.isAuthenticated!;
    //     this.getUserDetails();
    //   })
    // )
    var token:string = null;
    this.authService.accessToken.subscribe(data => {
      if( data != null){
        console.log("Access Token:"+data);
        this.getUserDetails(data);
      }
    });

  }

  getUserDetails(token:string){
    this.authService.getUserDetails(token).subscribe(
      data => {
        console.log("user info:"+JSON.stringify(data))
        this.userName=data.name;
        this.authService.isAuthenticated=true;
        this.isAuthenticated = this.authService.isAuthenticated;
        const theEmail = data.email;
        // store the userId in browser storage
        this.storage.setItem("userEmail", JSON.stringify(theEmail));
      }
    );
  }

  

  logout(){
    this.authService.isAuthenticated=false;
    this.isAuthenticated = this.authService.isAuthenticated;
    this.oauthService.logOut();
    window.location.href="/";
  }



}
