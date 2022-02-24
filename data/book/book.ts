
export interface Book {
    
    id: number;
    slug: string;
    image: string;
    title: string;
    author: string;
    description: string;

    price: number;
    yearIssued: number;
    pages: number;
    onPromotion: boolean;
    
    b: number;

}