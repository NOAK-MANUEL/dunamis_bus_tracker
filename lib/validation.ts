import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const createLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name is required")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

export const createBusSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bus name is required")
    .max(100),

  plateNumber: z
    .string()
    .trim()
    .min(1, "Plate number is required")
    .max(30),

  locationId: z
    .string()
    .uuid("Invalid location"),

  pin: z
    .string()
    .regex(/^\d{4,6}$/, "PIN must contain 4 to 6 digits"),
});

export const updateBusLocationSchema = z.object({
  busId: z.string().uuid(),

  latitude: z
    .number()
    .min(-90)
    .max(90),

  longitude: z
    .number()
    .min(-180)
    .max(180),

  accuracy: z
    .number()
    .nonnegative()
    .optional(),
});



export const busSchema = z.object({
  name: z
    .string()
    .min(2, "Bus name must be at least 2 characters")
    .max(50, "Bus name is too long"),
  plateNumber: z
    .string()
    .min(3, "Enter a valid plate number")
    .max(20, "Plate number is too long"),
  location: z.string().min(1, "Select a location"),
  pin: z
    .string()
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

export const locationSchema = z.object({
  name: z
    .string()
    .min(2, "Location name must be at least 2 characters")
    .max(50, "Location name is too long"),
  description: z
    .string()
    .max(200, "Description is too long")
    .optional(),
});

export const adminSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.email("Enter a valid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().min(6, "Please confirm your password"),

    // role: z.enum(["admin", "super_admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BusForm = z.infer<typeof busSchema>;
export type AdminForm = z.infer<typeof adminSchema>;


export type LocationForm = z.infer<typeof locationSchema>;

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type CreateBusInput = z.infer<typeof createBusSchema>;
export type UpdateBusLocationInput = z.infer<
  typeof updateBusLocationSchema
>;