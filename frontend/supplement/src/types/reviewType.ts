export type ReviewState = {
    userId: number;
    productId: number;
    rating: number;
    reviewDescription: string;
    reviewDate: Date;
};

export type ReviewProductState = {
    userName: string;
    productId: number;
    rating: number;
    reviewDescription: string;
    reviewDate: Date;
}