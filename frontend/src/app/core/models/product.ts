export class Product {
  constructor(
    public idProduct: number,
    public name: string,
    public description: string,
    public stock: number,
    public criticalStock: number,
    public status: string,
    public fungible: boolean
  ){}
}
