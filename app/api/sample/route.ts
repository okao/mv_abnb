import {
	createSiteSettings,
	getSiteSettings,
} from '@/services/site-settings';
import { NextRequest, NextResponse } from 'next/server';
import { parseRequestData } from '@/lib/parseRequestData';
import {
	siteSettingsSchema,
	siteSettingsAboutSchema,
	siteSettingsPrivacyPolicySchema,
	siteSettingsSocialMediaSchema,
	siteSettingsContactSchema,
	siteSettingsRefundPolicySchema,
	siteSettingsCookiePolicySchema,
	siteSettingsTermsAndConditionsSchema,
	siteSettingsPaymentGatewaySchema,
	siteSettingsPaymentGatewaysSchema,
} from '@/schemas';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { siteSettingsManager } from '@/services/siteSettings';
import {
	SiteSettingsSocialMedia,
	PaymentGateway,
	VisibilityStatus,
} from '@prisma/client';
export async function POST(req: NextRequest) {
	try {
		const combinedParams = await parseRequestData(req);

		// Validate and parse the combined parameters using siteSettingsSchema
		const parsedPayload = siteSettingsSchema.parse(combinedParams);
		// Update the site settings using the singleton
		await siteSettingsManager.updateSettings(parsedPayload);
		// Get the current settings
		const currentSettings = await siteSettingsManager.getSettings();
		//if about is included in the payload, update the about settings
		if (combinedParams.about) {
			const parsedAboutPayload = siteSettingsAboutSchema.parse(
				combinedParams.about
			);
			await siteSettingsManager.updateAbout(
				parsedAboutPayload,
				currentSettings.id
			);
		}

		if (combinedParams.privacyPolicy) {
			const parsedPrivacyPolicyPayload =
				siteSettingsPrivacyPolicySchema.parse(
					combinedParams.privacyPolicy
				);
			await siteSettingsManager.updatePrivacyPolicy(
				parsedPrivacyPolicyPayload,
				currentSettings.id
			);
		}

		if (combinedParams.contact) {
			const parsedContactPayload = siteSettingsContactSchema.parse(
				combinedParams.contact
			);
			await siteSettingsManager.updateContact(
				parsedContactPayload,
				currentSettings.id
			);
		}

		if (combinedParams.socialMedia) {
			//check if social media is an array
			if (!Array.isArray(combinedParams.socialMedia)) {
				return NextResponse.json(
					{ error: 'Social media must be an array' },
					{ status: 400 }
				);
			}

			//parse each social media object by looping through the array
			const parsedSocialMediaPayload = combinedParams.socialMedia.map(
				(socialMedia: []) =>
					siteSettingsSocialMediaSchema.parse(socialMedia)
			) as Partial<SiteSettingsSocialMedia[]>;

			// updateSocialMedia
			await siteSettingsManager.updateSocialMedia(
				parsedSocialMediaPayload,
				currentSettings.id
			);
		}

		if (combinedParams.paymentGateways) {
			//check if payment gateways is an array
			if (!Array.isArray(combinedParams.paymentGateways)) {
				return NextResponse.json(
					{ error: 'Payment gateways must be an array' },
					{ status: 400 }
				);
			}

			const parsedPaymentGatewaysPayload =
				combinedParams.paymentGateways.map((paymentGateway: []) =>
					siteSettingsPaymentGatewaySchema.parse(paymentGateway)
				) as Partial<PaymentGateway[]>;

			await siteSettingsManager.updatePaymentGateways(
				parsedPaymentGatewaysPayload,
				currentSettings.id
			);
		}

		if (combinedParams.refundPolicy) {
			const parsedRefundPolicyPayload =
				siteSettingsRefundPolicySchema.parse(
					combinedParams.refundPolicy
				);
			await siteSettingsManager.updateRefundPolicy(
				parsedRefundPolicyPayload,
				currentSettings.id
			);
		}

		if (combinedParams.cookiePolicy) {
			const parsedCookiePolicyPayload =
				siteSettingsCookiePolicySchema.parse(
					combinedParams.cookiePolicy
				);
			await siteSettingsManager.updateCookiePolicy(
				parsedCookiePolicyPayload,
				currentSettings.id
			);
		}

		if (combinedParams.termsAndConditions) {
			const parsedTermsAndConditionsPayload =
				siteSettingsTermsAndConditionsSchema.parse(
					combinedParams.termsAndConditions
				);
			await siteSettingsManager.updateTermsAndConditions(
				parsedTermsAndConditionsPayload,
				currentSettings.id
			);
		}

		let allSettings = {};
		allSettings = {
			...currentSettings,
		};

		// If combinedParams?.include is ['*'], include all the settings
		if (
			JSON.stringify(combinedParams?.include) ===
			JSON.stringify(['*'])
		) {
			const currentAbout = await siteSettingsManager.getAbout();
			const currentPrivacyPolicy =
				await siteSettingsManager.getPrivacyPolicy();
			const currentSocialMedia =
				await siteSettingsManager.getAllSocialMedia();
			const currentContact = await siteSettingsManager.getContact();
			const currentRefundPolicy =
				await siteSettingsManager.getRefundPolicy();
			const currentCookiePolicy =
				await siteSettingsManager.getCookiePolicy();
			const currentTermsAndConditions =
				await siteSettingsManager.getTermsAndConditions();

			const currentPaymentGateways =
				await siteSettingsManager.getPaymentGateways();

			allSettings = {
				...allSettings,
				about: currentAbout,
				privacyPolicy: currentPrivacyPolicy,
				socialMedia: currentSocialMedia,
				contact: currentContact,
				refundPolicy: currentRefundPolicy,
				cookiePolicy: currentCookiePolicy,
				termsAndConditions: currentTermsAndConditions,
				paymentGateways: currentPaymentGateways,
			};
		} else {
			let allIncludes = combinedParams?.include.map(
				(setting: string) => {
					return setting;
				}
			);

			if (allIncludes.includes('about')) {
				const currentAbout = await siteSettingsManager.getAbout();

				allSettings = {
					...allSettings,
					about: currentAbout,
				};
			}

			if (allIncludes.includes('privacyPolicy')) {
				const currentPrivacyPolicy =
					await siteSettingsManager.getPrivacyPolicy();
				allSettings = {
					...allSettings,
					privacyPolicy: currentPrivacyPolicy,
				};
			}

			if (allIncludes.includes('socialMedia')) {
				const currentSocialMedia =
					await siteSettingsManager.getAllSocialMedia();
				allSettings = {
					...allSettings,
					socialMedia: currentSocialMedia,
				};
			}

			if (allIncludes.includes('contact')) {
				const currentContact = await siteSettingsManager.getContact();
				allSettings = {
					...allSettings,
					contact: currentContact,
				};
			}

			if (allIncludes.includes('refundPolicy')) {
				const currentRefundPolicy =
					await siteSettingsManager.getRefundPolicy();
				allSettings = {
					...allSettings,
					refundPolicy: currentRefundPolicy,
				};
			}

			if (allIncludes.includes('cookiePolicy')) {
				const currentCookiePolicy =
					await siteSettingsManager.getCookiePolicy();
				allSettings = {
					...allSettings,
					cookiePolicy: currentCookiePolicy,
				};
			}

			if (allIncludes.includes('termsAndConditions')) {
				const currentTermsAndConditions =
					await siteSettingsManager.getTermsAndConditions();
				allSettings = {
					...allSettings,
					termsAndConditions: currentTermsAndConditions,
				};
			}

			if (allIncludes.includes('paymentGateways')) {
				const currentPaymentGateways =
					await siteSettingsManager.getPaymentGateways();
				allSettings = {
					...allSettings,
					paymentGateways: currentPaymentGateways,
				};
			}
		}

		// Return the updated settings as the response
		return NextResponse.json(allSettings);
	} catch (error: unknown) {
		console.error('Error processing request:', error);
		if (error instanceof ZodError) {
			// If it's a Zod validation error, return the validation errors
			return NextResponse.json(
				{ error: 'Validation Error', details: error.errors },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const currentSettings = await siteSettingsManager.getSettings();
		return NextResponse.json(currentSettings);
	} catch (error) {
		console.error('Error fetching site settings:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
