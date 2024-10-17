'use client';

import BackgroundSection from '@/components/BackgroundSection';
import ListingImageGallery from '@/components/listing-image-gallery/ListingImageGallery';
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories';
import SectionSubscribe2 from '@/components/SectionSubscribe2';
import {
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation';
import React, {
	ReactNode,
	Suspense,
	useEffect,
	useState,
} from 'react';
import MobileFooterSticky from './(components)/MobileFooterSticky';
import { imageGallery as listingStayImageGallery } from './listing-stay-detail/constant';
import { imageGallery as listingCarImageGallery } from './listing-car-detail/constant';
import { imageGallery as listingExperienceImageGallery } from './listing-experiences-detail/constant';
import { Route } from 'next';

// SearchParams Component
const SearchParamsComponent = ({
	setSearchParams,
}: {
	setSearchParams: (params: URLSearchParams) => void;
}) => {
	const searchParams = useSearchParams();
	useEffect(() => {
		setSearchParams(searchParams);
	}, [searchParams, setSearchParams]);

	return null;
};

const DetailtLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const thisPathname = usePathname();
	const [searchParams, setSearchParams] =
		useState<URLSearchParams | null>(null);

	// Wrap SearchParamsComponent correctly inside Suspense
	return (
		<Suspense fallback={<div>Loading search params...</div>}>
			<div className="ListingDetailPage">
				<SearchParamsComponent setSearchParams={setSearchParams} />

				<ListingImageGallery
					isShowModal={
						searchParams?.get('modal') === 'PHOTO_TOUR_SCROLLABLE'
					}
					onClose={() =>
						handleCloseModalImageGallery(router, thisPathname)
					}
					images={getImageGalleryListing(thisPathname)}
				/>

				<div className="container ListingDetailPage__content">
					{children}
				</div>

				{/* OTHER SECTION */}
				<div className="container py-24 lg:py-32">
					<div className="relative py-16">
						<BackgroundSection />
						<SectionSliderNewCategories
							heading="Explore by types of stays"
							subHeading="Explore houses based on 10 types of stays"
							categoryCardType="card5"
							itemPerRow={5}
							sliderStyle="style2"
						/>
					</div>
					<SectionSubscribe2 className="pt-24 lg:pt-32" />
				</div>

				{/* STICKY FOOTER MOBILE */}
				<MobileFooterSticky />
			</div>
		</Suspense>
	);
};

// Helper Functions
const handleCloseModalImageGallery = (
	router: any,
	thisPathname: string | null
) => {
	let params = new URLSearchParams(document.location.search);
	params.delete('modal');
	router.push(`${thisPathname}/?${params.toString()}` as Route);
};

const getImageGalleryListing = (pathname: string | null) => {
	if (pathname?.includes('/listing-stay-detail')) {
		return listingStayImageGallery;
	}
	if (pathname?.includes('/listing-car-detail')) {
		return listingCarImageGallery;
	}
	if (pathname?.includes('/listing-experiences-detail')) {
		return listingExperienceImageGallery;
	}
	return [];
};

export default DetailtLayout;
