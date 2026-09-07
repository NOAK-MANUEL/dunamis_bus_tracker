export type Location = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Bus = {
  id: string;
  name: string;
  plate_number: string;
  location_id: string;
  pin_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BusLocation = {
  id: string;
  bus_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  recorded_at: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
  created_at: string;
};