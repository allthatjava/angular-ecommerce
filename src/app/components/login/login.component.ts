import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../config/my-app-config';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  private token = null;

  constructor(private oauthService:OAuthService, private authService: AuthService, private http:HttpClient){
  }

  ngOnInit(): void {
    console.log("Login Component");
    this.authService.accessToken.subscribe(
      data => {
        this.token = data

        console.log("token:"+this.token);
        if( this.token == null){
          this.oauthService.initLoginFlow();

          const clientId = authConfig.clientId; // Replace with your GitHub OAuth App's Client ID
          const redirectUri = authConfig.redirectUri; // Your app's callback URL
          const randomUUID = uuidv4();
      
          const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user&state=${randomUUID}`;
      
          // window.location.href = authUrl;
          const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': 'http://localhost:4200/',
          })

          window.location.href=authUrl;
    
          // this.http.get<string>(authUrl, {headers:headers})
          // .subscribe(data => {
          //   console.log("11111:"+data);
          //   this.authService.accessToken.next(data);
          // }, error => 
          //   console.log("Error Message:"+error
          // ));

        }else{
          console.log("Has Access Token:"+this.token);
        }
      });

    
  }

}
