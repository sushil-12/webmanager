import { z } from 'zod';

export const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
    .min(1, 'Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const postSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters'),
  status: z.enum(['draft', 'published', 'archived']),
  seoTitle: z.string()
    .max(60, 'SEO title must be less than 60 characters')
    .optional(),
  seoDescription: z.string()
    .max(160, 'SEO description must be less than 160 characters')
    .optional(),
});

export const mediaSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  altText: z.string()
    .max(125, 'Alt text must be less than 125 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export const settingsSchema = z.object({
  siteName: z.string()
    .min(3, 'Site name must be at least 3 characters')
    .max(50, 'Site name must be less than 50 characters'),
  siteDescription: z.string()
    .max(160, 'Site description must be less than 160 characters')
    .optional(),
  adminEmail: z.string()
    .email('Invalid email address')
    .min(1, 'Admin email is required'),
}); 