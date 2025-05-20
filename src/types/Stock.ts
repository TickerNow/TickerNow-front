export interface Stock {
    name : string,
    open_price : number,
    high_price : number,
    low_price : number,
    close_price : number,
    price_change : number,
    change_rate : string,
    trading_volume : number,
    date : string
}

export interface StockSummary {
    summary: string;
}