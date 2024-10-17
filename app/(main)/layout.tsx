import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css';
import '@/styles/index.scss';
import ClientCommons from '@/shared/ClientCommons';
import SiteHeader from '@/app/(client-components)/(Header)/SiteHeader';
import FooterNav from '@/components/FooterNav';
import Footer from '@/components/Footer';

const poppins = Poppins({
	subsets: ['latin'],
	display: 'swap',
	weight: [
		'100',
		'200',
		'300',
		'400',
		'500',
		'600',
		'700',
		'800',
		'900',
	],
});

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: any;
}) {
	return (
		<div
			className={cn(
				poppins.className,
				'bg-white text-base dark:bg-gray-900 text-neutral-900 dark:text-neutral-200'
			)}
			lang="en"
		>
			<ClientCommons />
			<SiteHeader />
			{children}
			<FooterNav />
			<Footer />
		</div>
	);
}
