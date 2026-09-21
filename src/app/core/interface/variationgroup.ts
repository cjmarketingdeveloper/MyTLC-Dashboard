import { Product } from "./product";

export interface VariationGroup {
    variationCode: string;
    companyId: number;
    categoryId: number;
    variationLabel: string;      // e.g. Colour or shape or flavour
    variationValue: string;      // e.g. Red from the file
    products: Product[];
}