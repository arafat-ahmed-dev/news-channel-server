import { z } from 'zod';

// Zod validation schema
export const userValidationSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
      invalid_type_error: 'Full name must be a string',
    })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 characters'),

  avatar: z.string().url('Avatar must be a valid URL').optional(),

  status: z.enum(['active', 'inactive', 'suspended']).default('active'),

  isEmailVerified: z.boolean().default(false),
});

// Registration schema (subset of user schema)
export const registrationSchema = userValidationSchema.pick({
  fullName: true,
  email: true,
  username: true,
  password: true,
});

// Login schema
export const loginSchema = z.object({
  emailOrUsername: z
    .string({
      required_error: 'Email or username is required',
      invalid_type_error: 'Email or username must be a string',
    })
    .trim()
    .min(1, 'Email or username cannot be empty'),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(1, 'Password cannot be empty'),
});

// Profile update schema
export const profileUpdateSchema = userValidationSchema
  .pick({
    fullName: true,
    avatar: true,
  })
  .partial();

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Current password is required',
    })
    .min(1, 'Current password cannot be empty'),

  newPassword: z
    .string({
      required_error: 'New password is required',
    })
    .min(8, 'New password must be at least 8 characters'),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z
    .string({
      required_error: 'Verification token is required',
    })
    .min(1, 'Token cannot be empty'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z
    .string({
      required_error: 'Reset token is required',
    })
    .min(1, 'Token cannot be empty'),

  newPassword: z
    .string({
      required_error: 'New password is required',
    })
    .min(8, 'New password must be at least 8 characters'),
});

// Helper function to validate user registration data
export const validateUserRegistration = (userData) => {
  return registrationSchema.safeParse(userData);
};

// Helper function to validate user login data
export const validateUserLogin = (userData) => {
  return loginSchema.safeParse(userData);
};

// Helper function to validate profile update data
export const validateProfileUpdate = (userData) => {
  return profileUpdateSchema.safeParse(userData);
};

// Helper function to validate password change data
export const validatePasswordChange = (userData) => {
  return passwordChangeSchema.safeParse(userData);
};

// Helper function to validate email verification data
export const validateEmailVerification = (userData) => {
  return emailVerificationSchema.safeParse(userData);
};

// Helper function to validate forgot password data
export const validateForgotPassword = (userData) => {
  return forgotPasswordSchema.safeParse(userData);
};

// Helper function to validate reset password data
export const validateResetPassword = (userData) => {
  return resetPasswordSchema.safeParse(userData);
};
