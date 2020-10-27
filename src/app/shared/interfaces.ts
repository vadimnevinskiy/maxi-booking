export interface CurrencyList {
  Date: string,
  PreviousDate?: string,
  Timestamp?: string,
  Valute?: any
}

export interface CurrencyItem {
  ID: string,
  NumCode: string,
  CharCode: string,
  Nominal: number,
  Name: string,
  Value: number,
  Previous: number
}
