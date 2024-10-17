import {
	CredentialsProvider,
	GithubProvider,
	GoogleProvider,
} from '@/auth/providers';
import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById, updateUserById } from '@/services/user';
import { getTwoFactorConfirmationByUserId } from '@/services/two-factor-confirmation';
import { isExpired } from '@/lib/utils';
import { getAccountByUserId } from '@/services/account';
import { UserRole } from '@prisma/client';

export const authConfig: NextAuthConfig = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 24, // 1 Day
	},
	pages: {
		signIn: '/login',
		error: '/error',
	},
	events: {
		async linkAccount({ user }) {
			await updateUserById(user.id, { emailVerified: new Date() });
		},
	},
	callbacks: {
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(
				existingUser.id
			);

			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
			token.isOAuth = !!existingAccount;

			return token;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.isTwoFactorEnabled =
					token.isTwoFactorEnabled as boolean;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async signIn({ user, account }) {
			if (account?.provider !== 'credentials') return true;

			const existingUser = await getUserById(user.id);
			if (!existingUser?.emailVerified) return false;

			if (existingUser.isTwoFactorEnabled) {
				const existingTwoFactorConfirmation =
					await getTwoFactorConfirmationByUserId(existingUser.id);
				if (!existingTwoFactorConfirmation) return false;
				const hasExpired = isExpired(
					existingTwoFactorConfirmation.expires
				);
				if (hasExpired) return false;
			}

			return true;
		},
	},
	providers: [CredentialsProvider, GithubProvider, GoogleProvider],
};
