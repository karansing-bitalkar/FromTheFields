export type UserRole = "customer" | "farmer" | "admin" | "delivery";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  farmer: string;
  farmerId: string;
  organic: boolean;
  freshness: "ultra-fresh" | "fresh" | "good";
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  harvestDate: string;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "picked" | "in-transit" | "delivered" | "cancelled";
  date: string;
  deliveryAddress: string;
  deliveryPartnerId?: string;
  farmerId?: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: "weekly" | "monthly";
  items: string[];
  description: string;
  popular?: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  farm: string;
  location: string;
  approved: boolean;
  products: number;
  earnings: number;
  joinedAt: string;
  story?: string;
  image?: string;
}
