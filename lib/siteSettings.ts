import { db } from '@/lib/db';
import { SiteSettings, SiteSettingsAbout } from '@prisma/client';

class SiteSettingsManager {
	private static instance: SiteSettingsManager;
	private currentSettings: SiteSettings | null = null;
	private currentAbout: SiteSettingsAbout | null = null;

	private constructor() {}

	public static getInstance(): SiteSettingsManager {
		if (!SiteSettingsManager.instance) {
			SiteSettingsManager.instance = new SiteSettingsManager();
		}
		return SiteSettingsManager.instance;
	}

	async getSettings(): Promise<SiteSettings> {
		if (!this.currentSettings) {
			this.currentSettings = await db.siteSettings.findFirst({
				orderBy: { createdAt: 'desc' },
			});

			if (!this.currentSettings) {
				this.currentSettings = await db.siteSettings.create({
					data: {
						siteName: 'Default Site Name',
						siteDescription: 'Default Site Description',
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

		if (existingSettings) {
			this.currentSettings = await db.siteSettings.update({
				where: { id: existingSettings.id },
				data: newSettings,
			});
		} else {
			this.currentSettings = await db.siteSettings.create({
				data: newSettings,
			});
		}

		return this.currentSettings;
	}
}

export const siteSettingsManager = SiteSettingsManager.getInstance();
