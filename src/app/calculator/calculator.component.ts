import {Component, OnInit} from '@angular/core';
import {CurrencyList, Currency} from "../shared/interfaces";
import {CalculatorService} from "../shared/calculator.service";
import { VALUTE_NAME, API_JSON, API_XML, API_JSON2 } from "../shared/config";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  providers: [CalculatorService]
})


export class CalculatorComponent implements OnInit{
  rounded: boolean = false;
  roundedText: string = "Округлить";
  currencyList: CurrencyList;
  currency: Currency;
  rub: number;
  date: string = '';
  eur: number = 1;
  errorMsg = '';

  constructor(
    private calculatorService: CalculatorService,
  ) { }

  ngOnInit(){
    this.calculatorService.getCurrencyList(API_XML)
      .subscribe(response => {
        this.currencyList = response;
        this.currency = this.currencyList['Valute'][VALUTE_NAME];

        this.rub = this.currency.Value
        this.date = this.currencyList.Timestamp;
      }, error => {
        this.errorMsg = error.message;
      });

  }


  RoundRub() {
    if(!this.rounded){
      this.rub = this.calculatorService.getRoundRub(this.currency.Value);
      this.rounded = true;
      this.roundedText = "Показать";
    }else{
      this.rub = this.currency.Value;
      this.rounded = false;
      this.roundedText = "Округлить";
    }

  }




}
