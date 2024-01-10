import { Injectable } from '@angular/core';
import { authConfig } from '../config/my-app-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private gitHubApiUrl = "https://github.com/login/oauth/access_token";
  private clientId= authConfig.clientId;
  
  private baseUrl = environment.baseUrl;

  public isAuthenticated: boolean = false;
  accessToken:Subject<string> = new BehaviorSubject<string>(null);
  userDetail$:Observable<any>;
  token:string=null;

  constructor(private http:HttpClient) { }

  exchangeCodeForAccessToken(code: string) : Observable<any>{

    return this.http
      .post<any>(this.gitHubApiUrl, null, {
        params: {
          client_id: this.clientId,
          client_secret: '862a5369561dcc503e86f57c1340176080bf7791',
          code: code,
          redirect_uri: this.baseUrl+'/github-callback/'
        },
        headers: {
          'Accept': 'application/json',
        },
      })
      
  }

  getUserInfo(aToken:string){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${aToken}`,
      })

      return this.http.get(`https://api.github.com/user`, {headers:headers});
  }

  getUserDetails(token:string) : Observable<any> {
    // this.accessToken.subscribe(data => {
      // console.log("data:"+data);
      // this.token = data;
      this.userDetail$ = this.getUserInfo(token);
    // });

    // if(this.token != ''){
      // this.userFullName = this.oauthService.getIdentityClaims()['name'];
      return this.userDetail$;
    // }
  }

}
