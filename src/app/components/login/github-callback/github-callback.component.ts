import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-github-callback',
  templateUrl: './github-callback.component.html',
  styleUrls: ['./github-callback.component.css']
})
export class GithubCallbackComponent implements OnInit{

  private code = '';
  constructor(private route:ActivatedRoute, private authService:AuthService, private router: Router){}

  ngOnInit(){
        // To get the Access Token
        this.route.queryParams.subscribe((params) => {
          const code = params['code'];
          console.log("code:"+code);
    
          if( code){
            this.authService.exchangeCodeForAccessToken(code).subscribe( (res) => {
              console.log("res:"+JSON.stringify(res));
              const accessToken = res.access_token;
              console.log("access_token:"+accessToken);
              this.authService.accessToken.next(accessToken);

              // this.authService.accessToken.subscribe(
              //   data=> {
              //     this.code=data
              //     console.log("accessToken:"+this.code);
              //   });
              this.router.navigateByUrl("");
            })
          }else{
            console.error('GitHub authorization code not found');
          }
        });
  }
}
