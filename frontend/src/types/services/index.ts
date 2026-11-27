export interface LaundryService {
    id: number;
    name: string;
    description: string | null;
    price: string;
    active: boolean;
}