declare module "currency-converter-lt" {
  interface CurrencyConverterOptions {
    from?: string;
    to?: string;
    amount?: number;
    isDecimalComma?: boolean;
  }

  class CurrencyConverter {
    constructor(options?: CurrencyConverterOptions);
    convert(amount?: number): Promise<number>;
    from(currency: string): this;
    to(currency: string): this;
    amount(amount: number): this;
    rates(): Promise<Record<string, number>>;
    setupRatesCache(options: {
      isRatesCaching: boolean;
      ratesCacheDuration: number;
    }): this;
  }

  export default CurrencyConverter;
}
