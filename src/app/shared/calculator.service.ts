import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CurrencyList, Currency} from "./interfaces";
import {Observable, throwError} from "rxjs";
import { API_JSON, API_XML, API_JSON2 } from "../shared/config";
import {catchError} from "rxjs/operators";

@Injectable()
export class CalculatorService {
  currencyList: CurrencyList;
  currency: Currency;

  constructor(private http: HttpClient) {
  }


  // Get data from server
  getCurrencyList(api): Observable<CurrencyList> {
    return this.http.get<CurrencyList>(api)
      .pipe(
        catchError(error => {
          // debugger;
          console.log(error.message);
          this.getCurrencyList(API_JSON2)
          return throwError(error)
        })
      );
  }

  getCurrencyListXML(api) {
    return this.http.get(api, { responseType: 'text'});
  }

  // Round a number to two decimal
  getRoundRub(val) {
    return Math.round(val * 100) / 100;
  }



}
