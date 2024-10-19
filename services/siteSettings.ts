import { db } from '@/lib/db';
import {
	SiteSettings,
	SiteSettingsAbout,
	SiteSettingsPrivacyPolicy,
	VisibilityStatus,
	SiteSettingsSocialMedia,
	SocialMediaType,
	SiteSettingsContact,
	SiteSettingsTermsAndConditions,
	SiteSettingsRefundPolicy,
	SiteSettingsCookiePolicy,
	PaymentGateway,
} from '@prisma/client';

class SiteSettingsManager {
	private static instance: SiteSettingsManager;
	private currentSettings: SiteSettings | null = null;
	private currentAbout: SiteSettingsAbout | null = null;
	private currentPrivacyPolicy: SiteSettingsPrivacyPolicy | null =
		null;
	private currentSocialMedia: SiteSettingsSocialMedia[] = [];
	private currentContact: SiteSettingsContact | null = null;
	private currentTermsAndConditions: SiteSettingsTermsAndConditions | null =
		null;
	private currentRefundPolicy: SiteSettingsRefundPolicy | null = null;
	private currentCookiePolicy: SiteSettingsCookiePolicy | null = null;
	private currentPaymentGateway: PaymentGateway[] = [];
	private relatedSettingsArray = [
		'about',
		'privacyPolicy',
		'socialMedia',
		'contact',
		'logo',
		'termsAndConditions',
		'refundPolicy',
		'cookiePolicy',
		'paymentGateway',
	];

	private constructor() {}

	public static getInstance(): SiteSettingsManager {
		if (!SiteSettingsManager.instance) {
			SiteSettingsManager.instance = new SiteSettingsManager();
		}
		return SiteSettingsManager.instance;
	}

	async getSettings(): Promise<SiteSettings> {
		if (!this.currentSettings) {
			// Fetch the latest settings from the database
			this.currentSettings = await db.siteSettings.findFirst({
				include: {
					siteSettingsLogoToImage: true,
					siteSettingsSocialMedia: true,
					siteSettingsContact: true,
					siteSettingsAbout: true,
					siteSettingsPrivacyPolicy: true,
					siteSettingsTermsAndConditions: true,
					siteSettingsRefundPolicy: true,
					siteSettingsCookiePolicy: true,
				},
				orderBy: { createdAt: 'desc' },
			});

			if (!this.currentSettings) {
				// If no settings exist, create default settings
				this.currentSettings = await db.siteSettings.create({
					data: {
						// Set your default values here
						siteName: 'Default Site Name',
						siteDescription: 'Default Site Description',
						// ... other default values
					},
				});
			}
		}
		return this.currentSettings;
	}

	async updateSettings(
		newSettings: Partial<SiteSettings>
	): Promise<SiteSettings> {
		const existingSettings = await this.getSettings();
		//from newSettings object, get all keys that are in the relatedSettingsArray and pop them from the newSettings object
		const newSettingsWithoutRelated = Object.keys(newSettings).reduce(
			(acc, key) => {
				if (!this.relatedSettingsArray.includes(key)) {
					acc[key] = newSettings[
						key as keyof typeof newSettings
					] as any;
				}
				return acc;
			},
			{} as Record<string, any>
		);

		console.log(
			'newSettingsWithoutRelated',
			newSettingsWithoutRelated
		);

		if (existingSettings) {
			// Update existing settings
			this.currentSettings = await db.siteSettings.update({
				where: { id: existingSettings.id },
				data: newSettingsWithoutRelated,
			});
		} else {
			// Create new settings if none exist
			this.currentSettings = await db.siteSettings.create({
				data: newSettingsWithoutRelated,
			});
		}

		return this.currentSettings;
	}

	//updateAbout
	async updateAbout(
		newAbout: Partial<SiteSettingsAbout>,
		siteSettingsId: string
	): Promise<SiteSettingsAbout> {
		const existingAbout = await this.getAbout();

		if (existingAbout) {
			// Update existing about
			this.currentAbout = await db.siteSettingsAbout.update({
				where: { id: existingAbout.id },
				data: newAbout,
			});
		} else {
			// Create new about if none exist
			this.currentAbout = await db.siteSettingsAbout.create({
				data: {
					title: newAbout.title || '',
					description: newAbout.description || '',
					visibilityStatus:
						newAbout.visibilityStatus || VisibilityStatus.Active,
					siteSettingsId: siteSettingsId,
				},
			});
		}
		return this.currentAbout;
	}

	//getAbout
	async getAbout(): Promise<SiteSettingsAbout | null> {
		const existingAbout = await db.siteSettingsAbout.findFirst();
		return existingAbout;
	}

	//updatePrivacyPolicy
	async updatePrivacyPolicy(
		newPrivacyPolicy: Partial<SiteSettingsPrivacyPolicy>,
		siteSettingsId: string
	): Promise<SiteSettingsPrivacyPolicy> {
		const existingPrivacyPolicy = await this.getPrivacyPolicy();

		if (existingPrivacyPolicy) {
			this.currentPrivacyPolicy =
				await db.siteSettingsPrivacyPolicy.update({
					where: { id: existingPrivacyPolicy.id },
					data: newPrivacyPolicy,
				});
		} else {
			let dataWithoutVisibilityStatus = {
				...newPrivacyPolicy,
				visibilityStatus:
					newPrivacyPolicy.visibilityStatus ||
					VisibilityStatus.Active,
				title: newPrivacyPolicy.title || '',
				description: newPrivacyPolicy.description || '',
				siteSettingsId: siteSettingsId,
			};

			this.currentPrivacyPolicy =
				await db.siteSettingsPrivacyPolicy.create({
					data: dataWithoutVisibilityStatus,
				});
		}

		return this.currentPrivacyPolicy;
	}

	//getPrivacyPolicy
	async getPrivacyPolicy(): Promise<SiteSettingsPrivacyPolicy | null> {
		const existingPrivacyPolicy =
			await db.siteSettingsPrivacyPolicy.findFirst();
		return existingPrivacyPolicy;
	}

	//get All Social Media
	async getAllSocialMedia(): Promise<SiteSettingsSocialMedia[]> {
		const existingSocialMedia =
			await db.siteSettingsSocialMedia.findMany();
		return existingSocialMedia;
	}

	//updateSocialMedia
	async updateSocialMedia(
		newSocialMedias: Partial<SiteSettingsSocialMedia[]>,
		siteSettingsId: string
	): Promise<SiteSettingsSocialMedia[]> {
		newSocialMedias.forEach(async (socialMedia) => {
			//if type is not exist
			const isTypeExist =
				socialMedia?.type &&
				Object.values(SocialMediaType).includes(
					socialMedia?.type as SocialMediaType
				);

			if (!isTypeExist) {
				//continue to the next media
				return;
			}

			//update if the social media already exists
			const existingSocialMedia =
				await db.siteSettingsSocialMedia.findFirst({
					where: {
						type: socialMedia?.type as SocialMediaType,
					},
				});

			if (existingSocialMedia) {
				//update the social media
				await db.siteSettingsSocialMedia.update({
					where: {
						id: existingSocialMedia.id,
					},
					data: socialMedia,
				});
			} else {
				//create a new social media
				await db.siteSettingsSocialMedia.create({
					data: {
						...socialMedia,
						siteSettingsId: siteSettingsId,
					},
				});
			}
		});

		const allSocialMedia = await this.getAllSocialMedia();
		this.currentSocialMedia = allSocialMedia;

		return this.currentSocialMedia as SiteSettingsSocialMedia[];
	}

	//getSocialMedia by type
	async getSocialMediaType(
		type: SocialMediaType
	): Promise<SiteSettingsSocialMedia | null> {
		const existingSocialMedia =
			await db.siteSettingsSocialMedia.findFirst({
				where: { type: type },
			});
		return existingSocialMedia;
	}

	//getContact
	async getContact(): Promise<SiteSettingsContact | null> {
		const existingContact = await db.siteSettingsContact.findFirst();
		return existingContact;
	}

	//updateContact
	async updateContact(
		newContact: Partial<SiteSettingsContact>,
		siteSettingsId: string
	): Promise<SiteSettingsContact> {
		const existingContact = await this.getContact();

		if (existingContact) {
			this.currentContact = await db.siteSettingsContact.update({
				where: { id: existingContact.id },
				data: newContact,
			});
		} else {
			this.currentContact = await db.siteSettingsContact.create({
				data: {
					...newContact,
					siteSettingsId: siteSettingsId,
				},
			});
		}

		return this.currentContact;
	}

	//getTermsAndConditions
	async getTermsAndConditions(): Promise<SiteSettingsTermsAndConditions | null> {
		const existingTermsAndConditions =
			await db.siteSettingsTermsAndConditions.findFirst();
		return existingTermsAndConditions;
	}

	//updateTermsAndConditions
	async updateTermsAndConditions(
		newTermsAndConditions: Partial<SiteSettingsTermsAndConditions>,
		siteSettingsId: string
	): Promise<SiteSettingsTermsAndConditions> {
		const existingTermsAndConditions =
			await this.getTermsAndConditions();

		if (existingTermsAndConditions) {
			this.currentTermsAndConditions =
				await db.siteSettingsTermsAndConditions.update({
					where: { id: existingTermsAndConditions.id },
					data: newTermsAndConditions,
				});
		} else {
			this.currentTermsAndConditions =
				await db.siteSettingsTermsAndConditions.create({
					data: {
						...newTermsAndConditions,
						visibilityStatus:
							newTermsAndConditions.visibilityStatus ||
							VisibilityStatus.Active,
						title: newTermsAndConditions.title || '',
						description: newTermsAndConditions.description || '',
						siteSettingsId: siteSettingsId,
					},
				});
		}

		return this.currentTermsAndConditions;
	}

	//getRefundPolicy
	async getRefundPolicy(): Promise<SiteSettingsRefundPolicy | null> {
		const existingRefundPolicy =
			await db.siteSettingsRefundPolicy.findFirst();
		return existingRefundPolicy;
	}

	//updateRefundPolicy
	async updateRefundPolicy(
		newRefundPolicy: Partial<SiteSettingsRefundPolicy>,
		siteSettingsId: string
	): Promise<SiteSettingsRefundPolicy> {
		const existingRefundPolicy = await this.getRefundPolicy();

		if (existingRefundPolicy) {
			this.currentRefundPolicy =
				await db.siteSettingsRefundPolicy.update({
					where: { id: existingRefundPolicy.id },
					data: newRefundPolicy,
				});
		} else {
			this.currentRefundPolicy =
				await db.siteSettingsRefundPolicy.create({
					data: {
						...newRefundPolicy,
						siteSettingsId: siteSettingsId,
						visibilityStatus:
							newRefundPolicy.visibilityStatus ||
							VisibilityStatus.Active,
						title: newRefundPolicy.title || '',
						description: newRefundPolicy.description || '',
					},
				});
		}

		return this.currentRefundPolicy;
	}

	//getCookiePolicy
	async getCookiePolicy(): Promise<SiteSettingsCookiePolicy | null> {
		const existingCookiePolicy =
			await db.siteSettingsCookiePolicy.findFirst();
		return existingCookiePolicy;
	}

	//updateCookiePolicy
	async updateCookiePolicy(
		newCookiePolicy: Partial<SiteSettingsCookiePolicy>,
		siteSettingsId: string
	): Promise<SiteSettingsCookiePolicy> {
		const existingCookiePolicy = await this.getCookiePolicy();

		if (existingCookiePolicy) {
			this.currentCookiePolicy =
				await db.siteSettingsCookiePolicy.update({
					where: { id: existingCookiePolicy.id },
					data: newCookiePolicy,
				});
		} else {
			this.currentCookiePolicy =
				await db.siteSettingsCookiePolicy.create({
					data: {
						...newCookiePolicy,
						siteSettingsId: siteSettingsId,
						visibilityStatus:
							newCookiePolicy.visibilityStatus ||
							VisibilityStatus.Active,
						title: newCookiePolicy.title || '',
						description: newCookiePolicy.description || '',
					},
				});
		}

		return this.currentCookiePolicy;
	}

	//getPaymentGateways
	async getPaymentGateways(): Promise<PaymentGateway[]> {
		const existingPaymentGateways =
			await db.paymentGateway.findMany();
		return existingPaymentGateways;
	}

	//getPaymentGatewayByName
	async getPaymentGatewayByName(
		name: string
	): Promise<PaymentGateway | null> {
		const existingPaymentGateway = await db.paymentGateway.findFirst({
			where: { name: name },
		});
		return existingPaymentGateway;
	}

	//updatePaymentGateway
	async updatePaymentGateway(
		newPaymentGateway: Partial<PaymentGateway>,
		siteSettingsId: string,
		visibilityStatus: VisibilityStatus
	): Promise<Boolean> {
		try {
			const existingPaymentGateway =
				await this.getPaymentGatewayByName(
					newPaymentGateway?.name || ''
				);

			if (existingPaymentGateway) {
				await db.paymentGateway.update({
					where: { id: existingPaymentGateway.id },
					data: newPaymentGateway,
					include: {
						paymentGatewayToSiteSettings: true,
					},
				});
			} else {
				await db.paymentGateway.create({
					data: {
						name: newPaymentGateway.name || '',
						description: newPaymentGateway.description || '',
						apiKey: newPaymentGateway.apiKey || '',
						apiSecret: newPaymentGateway.apiSecret || '',
						apiUrl: newPaymentGateway.apiUrl || '',
						apiVersion: newPaymentGateway.apiVersion || '',
						apiDocumentationUrl:
							newPaymentGateway.apiDocumentationUrl || '',
						isActive: newPaymentGateway.isActive || false,
						isDefault: newPaymentGateway.isDefault || false,

						paymentGatewayToSiteSettings: {
							create: {
								siteSettingsId: siteSettingsId,
								visibilityStatus:
									visibilityStatus || VisibilityStatus.Active,
							},
						},
					},
					include: {
						paymentGatewayToSiteSettings: true,
					},
				});
			}

			return true;
		} catch (error) {
			console.error('Error updating payment gateway:', error);
			return false;
		}
	}

	//updateManyPaymentGateways
	async updatePaymentGateways(
		newPaymentGateways: Partial<PaymentGateway[]>,
		siteSettingsId: string,
		visibilityStatus: VisibilityStatus = VisibilityStatus.Active
	): Promise<Boolean> {
		try {
			//loop through the newPaymentGateways array
			newPaymentGateways.forEach(async (paymentGateway) => {
				await this.updatePaymentGateway(
					paymentGateway as Partial<PaymentGateway>,
					siteSettingsId,
					visibilityStatus
				);
			});

			return true;
		} catch (error) {
			console.error('Error updating payment gateways:', error);
			return false;
		}
	}
}

export const siteSettingsManager = SiteSettingsManager.getInstance();
