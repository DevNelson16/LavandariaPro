export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  active: boolean;
}