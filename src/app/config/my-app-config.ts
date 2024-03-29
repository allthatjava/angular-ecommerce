import {AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

export const authConfig: AuthConfig = {
        // clientId: '0oabn1refstdZUrrs5d7',
        // issuer: 'https://dev-66596212.okta.com/oauth2/default',
        // redirectUri: 'http://localhost:4200/login/callback',
        // scopes: ['openid', 'profile', 'email']
        clientId: 'b268aff959e193a63591',
        issuer: 'https://github.com/login/oauth/authorize',
        responseType:'code',
        redirectUri: baseUrl+"/github-callback/",
        scope: 'read:user'
}
