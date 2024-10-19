import { z } from 'zod';
import { SocialMediaType, VisibilityStatus } from '@prisma/client';

const EMAIL_SCHEMA = z
	.string()
	.min(1, 'Email Address is required.')
	.email('Invalid Email Address.');

export const loginSchema = z.object({
	email: EMAIL_SCHEMA,
	password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z.object({
	email: EMAIL_SCHEMA,
	name: z
		.string()
		.min(1, {
			message: 'Name is required.',
		})
		.min(4, 'Name must be at least 4 characters.')
		.max(24, 'Maximum length of Name is 24 characters.'),
	password: z
		.string()
		.min(1, 'Password is required.')
		.min(6, 'Password must be at least 6 characters.'),
});

export const resendSchema = z.object({
	email: EMAIL_SCHEMA,
});

export const resetPasswordSchema = z.object({
	email: EMAIL_SCHEMA,
});

export const newPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, 'Password is required.')
			.min(6, 'Password must be at least 6 characters.'),
		confirmPassword: z
			.string()
			.min(1, 'Confirm Password is required.'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password doesn't match.",
		path: ['confirmPassword'],
	});

export const twoFactorSchema = z.object({
	code: z
		.string()
		.regex(/^[0-9]+$/, 'Code must be a number.')
		.length(6, 'Code must be 6 digits long.'),
});

export const profileSchema = z
	.object({
		name: z.optional(
			z
				.string()
				.min(1, {
					message: 'Name is required.',
				})
				.min(4, 'Name must be at least 4 characters.')
				.max(24, 'Maximum length of Name is 24 characters.')
		),
		email: z.optional(z.string().email()),
		password: z.optional(
			z.string().min(6, 'Password must be at least 6 characters.')
		),
		newPassword: z.optional(
			z.string().min(6, 'New Password must be at least 6 characters.')
		),
		isTwoFactorEnabled: z.optional(z.boolean()),
	})
	.refine(
		(data) => {
			if (!data.password && data.newPassword) return false;
			return true;
		},
		{
			message: 'Password is required.',
			path: ['password'],
		}
	)
	.refine(
		(data) => {
			if (data.password && !data.newPassword) return false;
			return true;
		},
		{
			message: 'New Password is required.',
			path: ['newPassword'],
		}
	);

//site settings about schema
export const siteSettingsAboutSchema = z.object({
	title: z.string().min(1, 'Title is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings privacy policy schema
export const siteSettingsPrivacyPolicySchema = z.object({
	title: z.string().min(1, 'Title is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings social media schema
export const siteSettingsSocialMediaSchema = z.object({
	type: z.enum(
		Object.values(SocialMediaType) as [string, ...string[]]
	),
	name: z.string().min(1, 'Name is required.').optional(),
	url: z.string().min(1, 'URL is required.').optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings contact schema
export const siteSettingsContactSchema = z.object({
	email: z.string().email('Invalid Email Address.').optional(),
	phone: z.string().min(1, 'Phone is required.').optional(),
	address: z.string().min(1, 'Address is required.').optional(),
	city: z.string().min(1, 'City is required.').optional(),
	state: z.string().min(1, 'State is required.').optional(),
	zip: z.string().min(1, 'Zip is required.').optional(),
	country: z.string().min(1, 'Country is required.').optional(),
});

//site settings terms and conditions schema
export const siteSettingsTermsAndConditionsSchema = z.object({
	title: z.string().min(1, 'Title is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings refund policy schema
export const siteSettingsRefundPolicySchema = z.object({
	title: z.string().min(1, 'Title is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings cookie policy schema
export const siteSettingsCookiePolicySchema = z.object({
	title: z.string().min(1, 'Title is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//site settings payment gateway schema
export const siteSettingsPaymentGatewaySchema = z.object({
	name: z.string().min(1, 'Name is required.').optional(),
	description: z
		.string()
		.min(1, 'Description is required.')
		.optional(),
	apiKey: z.string().min(1, 'API Key is required.').optional(),
	apiSecret: z.string().min(1, 'API Secret is required.').optional(),
	apiUrl: z.string().min(1, 'API URL is required.').optional(),
	apiVersion: z
		.string()
		.min(1, 'API Version is required.')
		.optional(),
	apiDocumentationUrl: z
		.string()
		.min(1, 'API Documentation URL is required.')
		.optional(),
	isActive: z.boolean().optional(),
	isDefault: z.boolean().optional(),
	visibilityStatus: z
		.enum([
			VisibilityStatus.Active,
			VisibilityStatus.Inactive,
			VisibilityStatus.Redacted,
		])
		.optional(),
});

//siteSettingsPaymentGatewaysSchema
export const siteSettingsPaymentGatewaysSchema = z.object({
	paymentGateways: z.array(siteSettingsPaymentGatewaySchema),
});

//site settings schema
export const siteSettingsSchema = z.object({
	siteName: z.string().min(1, 'Site Name is required.').optional(),
	siteDescription: z
		.string()
		.min(1, 'Site Description is required.')
		.optional(),
	siteTheme: z.enum(['Light', 'Dark', 'System']).optional(),
	siteDefaultCurrency: z
		.string()
		.min(1, 'Site Default Currency is required.')
		.optional(),
	siteDefaultLanguage: z
		.string()
		.min(1, 'Site Default Language is required.')
		.optional(),
	siteDefaultTimezone: z
		.string()
		.min(1, 'Site Default Timezone is required.')
		.optional(),

	//related to about
	about: z.optional(siteSettingsAboutSchema),
	privacyPolicy: z.optional(siteSettingsPrivacyPolicySchema),
	socialMedia: z.array(siteSettingsSocialMediaSchema).optional(),
	contact: z.optional(siteSettingsContactSchema),
	termsAndConditions: z.optional(
		siteSettingsTermsAndConditionsSchema
	),
	refundPolicy: z.optional(siteSettingsRefundPolicySchema),
	cookiePolicy: z.optional(siteSettingsCookiePolicySchema),
	paymentGateway: z.optional(siteSettingsPaymentGatewaySchema),
});
