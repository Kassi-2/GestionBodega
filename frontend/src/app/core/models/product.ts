export class Product {
  constructor(
    public idProduct: number,
    public name: string,
    public description: string,
    public stock: number | null,
    public criticalStock: number | null,
    public status: boolean,
    public isFungible: boolean
  ) {}
}

