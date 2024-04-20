export type ProductState = {
    id: number;
    name: string;
    title: string;
    imageUrl: string;
    blurhashImg: string;
    flavours: Record<string, string>;
    ingredients: string[];
    price: number;
    weight: number;
    servingAmount: number;
    quantity: number;
    description: string;
    usageDescription: string;
    nutritionFacts: Record<string, number>;
    categoryName: string;
};