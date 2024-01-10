import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private apiUrl = environment.apiUrl+"/api";

  private countriesUrl = this.apiUrl+"/countries";
  private statesUrl = this.apiUrl+"/states";

  constructor(private httpClient:HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(respones => respones._embedded.countries)
    );
  }

  getStates(theCountryCode:string): Observable<State[]>{

    const searchStateUrl = this.statesUrl+"/search/findByCountryCode?code="+theCountryCode;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(respones => respones._embedded.states)
    );
  }


  getExpirationMonth(startMonth:number):Observable<number[]>{

    let months = [];

    for( var i=startMonth; i<= 12; i++){
      months.push(i);
    }

    return of(months);

  }

  getExpirationYear():Observable<number[]>{

    let years=[];

    let startYear:number= new Date().getFullYear();

    for( var year=startYear; year< startYear+10; year++){
      years.push(year);
    }

    return of(years);

  }
}

interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
