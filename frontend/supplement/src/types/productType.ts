export type ProductState = {
    id: number;
    name: string;
    title: string;
    imageUrl: string;
    flavors: string[],
    ingredients: string[],
    price: number,
    weight: number;
    quantity: number;
    description: string;
    usageDescription: string;
    nutritionFacts: Record<string, number>;
    categoryId: number;
};