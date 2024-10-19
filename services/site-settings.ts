import { db } from '@/lib/db';
import { siteSettingsSchema } from '@/schemas';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const getSiteSettings = async () => {
	try {
		const siteSettings = await db.siteSettings.findFirst({
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
		});

		return siteSettings;
	} catch {
		return null;
	}
};

type UpdateSiteSettingsType = Prisma.Args<
	typeof db.siteSettings,
	'update'
>['data'];
export const updateSiteSettings = async (
	id: string,
	payload: UpdateSiteSettingsType
) => {
	try {
		return await db.siteSettings.update({
			where: { id },
			data: payload,
		});
	} catch {
		return null;
	}
};

export const createSiteSettings = async (
	payload: z.infer<typeof siteSettingsSchema>
) => {
	try {
		return await db.siteSettings.create({
			data: payload,
		});
	} catch (error) {
		console.error('Error creating site settings:', error);
		throw error;
	}
};
