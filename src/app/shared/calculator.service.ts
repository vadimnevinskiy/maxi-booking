import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CurrencyList} from "./interfaces";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import xml2js from 'xml2js';

@Injectable()
export class CalculatorService {

  constructor(private http: HttpClient) {}


  // Get JSON data from server
  getCurrencyList(api): Observable<CurrencyList> {
    return this.http.get<CurrencyList>(api)
      .pipe(
        catchError(error => {
          console.log(error.message);
          return throwError(error)
        })
      );
  }

  // Get XML data from server
  getCurrencyListXML(api) {
    return this.http.get(api, { responseType: 'text'});
  }


  // Parsing XML to JSON object
  parseXML(data) {
    return new Promise(resolve => {
      let parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
      parser.parseString(data, function (err, result) {
        resolve(result);
      });
    });
  }

  // Date formatting for JSON is similar to XML
  getFormattedDate(date){
    let result = '';
    result = date.split('T')[0];
    result = result.split('-')[2] + '.' + result.split('-')[1] + '.' + result.split('-')[0]
    return result;
  }


  // Replacing ',' to '.'
  replacementFloat(val){
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(val))
      return Number(val);
    return Number.parseFloat(val.replace(/,/g, "."));
  }




  // Rounding a amount to two decimal
  getRoundAmount(ammount) {
    return Math.round(ammount * 100) / 100;
  }



}
