import {Component, OnInit} from '@angular/core';
import {CurrencyList, CurrencyItem} from "../shared/interfaces";
import {CalculatorService} from "../shared/calculator.service";
import { VALUTE_NAME, API_JSON, API_XML, API_XML2, API_JSON2 } from "../shared/config";


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  providers: [CalculatorService]
})


export class CalculatorComponent implements OnInit{
  // VARIABLES
  rounded: boolean = false; // Catch the state if the user has rounded up the amount
  roundedText: string = "Округлить"; // Simple string to display in the UI
  dateString: string = ''; // Simple string to display date in the UI
  errorMsg:string = null; // Simple string to display Error Message in the UI

  currencyList: CurrencyList; // Includes all data from the server
  currencyItem: CurrencyItem; // Includes selected item from the CurrencyList

  amountResultValue: number; // Final result for display in the UI
  formattedResult: number; // The variable is needed to save the value in the required format for further work

  inputDataValue: number = 1; // Input data value

  jsonResponse: any; // To save converted XML to JSON result

  helpTxt: string; // Simple string to display API format in the UI

  apiXml: string = API_XML; // Save API url for XML
  apiJson: string = API_JSON; // Save API url for JSON


  constructor(
    private calculatorService: CalculatorService,
  ) { }




  ngOnInit(){
    // this.getXmlFromService(); // Get all data at XML format from calculatorService
    // this.getJsonFromService(); // Get all data at JSON format from calculatorService
    this.startMonitoring();
  }

  //Set API Error from radio buttons
  setAPIError(event) {
     let errorValue = event.target.value; // Get current value
     if(errorValue == 'error_xml'){
       this.apiXml = API_XML2;
       this.apiJson = API_JSON;
     }else if(errorValue == 'error_json'){
       this.apiJson = API_JSON2;
       this.apiXml = API_XML;
     }else if(errorValue == 'correct_all'){
       this.apiJson = API_JSON;
       this.apiXml = API_XML;
     }
  }

  startMonitoring(){
    this.getXmlFromService(); // FIRST LOADING - Get all data at JSON format from calculatorService
    setInterval(() => {
      if(this.apiXml == API_XML2){
        console.log('Request to error XML');
        this.getXmlFromService(); // Get all data at JSON format from calculatorService
      }else if(this.apiJson == API_JSON2){
        console.log('Request to error JSON');
        this.getJsonFromService(); // Get all data at JSON format from calculatorService
      }else{
        this.getXmlFromService(); // Get all data at JSON format from calculatorService
      }
    }, 2000)
  }



  // Get all data at XML format from calculatorService
  getXmlFromService(){
    this.helpTxt = 'XML';
    this.calculatorService.getCurrencyListXML(this.apiXml)
      .subscribe(response => {
        this.calculatorService.parseXML(response) // Parse XML to JSON format
          .then((dataJson) => {
            this.jsonResponse = dataJson;
            this.currencyList = this.jsonResponse.ValCurs;
            for(let i = 0; i < this.currencyList.Valute.length; i++){
              if (this.currencyList.Valute[i].CharCode[0] == VALUTE_NAME){
                this.currencyItem = this.currencyList.Valute[i];

                this.dateString = this.currencyList['$'].Date; // Saving date adn time
                this.formattedResult = this.calculatorService.replacementFloat(this.currencyItem.Value[0]); // Save formatted result
                this.amountResultValue = this.formattedResult; // Save formatted result
                break;
              }
            }
          });
      }, error => {
        this.getJsonFromService(); // Get all data at JSON format from calculatorService
      })
  }



  // Get all data at JSON format from calculatorService
  getJsonFromService() {
    this.helpTxt = 'JSON';
    this.calculatorService.getCurrencyList(this.apiJson)
      .subscribe(response => {
        this.currencyList = response; // Save response to currencyList
        this.currencyItem = this.currencyList['Valute'][VALUTE_NAME]; // Select item currency by VALUTE_NAME field to currencyItem

        this.dateString = this.calculatorService.getFormattedDate(this.currencyList.Date); // Saving date adn time

        this.formattedResult = this.currencyItem.Value // Saving formatted result
        this.amountResultValue = this.formattedResult; // For display in UI

      }, error => {
        this.getXmlFromService(); // Get all data at XML format from calculatorService
      });
  }


  // Click handler for rounded amount
  RoundHandler() {
    if(!this.rounded){
      this.amountResultValue = this.calculatorService.getRoundAmount(this.formattedResult);
      this.rounded = true;
      this.roundedText = "Показать";
    }else{
      this.amountResultValue = this.formattedResult;
      this.rounded = false;
      this.roundedText = "Округлить";
    }
  }
}
