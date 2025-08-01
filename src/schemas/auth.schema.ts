import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  phone: z.string()
    .regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE phone number')
    .optional(),
  role: z.enum(['individual', 'dealer']).default('individual'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

// User profile update schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string()
    .regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE phone number')
    .optional(),
  image: z.string().url('Please enter a valid image URL').optional(),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Dealer verification schema
export const dealerVerificationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(200),
  businessAddress: z.string().min(10, 'Business address must be at least 10 characters').max(500),
  tradeLicenseNumber: z.string().min(5, 'Trade license number must be at least 5 characters').max(50),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters').max(100),
  businessPhone: z.string()
    .regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE phone number'),
  website: z.string().url('Please enter a valid website URL').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  documents: z.array(z.string().url()).min(1, 'At least one document is required').max(10),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type DealerVerificationData = z.infer<typeof dealerVerificationSchema>;
