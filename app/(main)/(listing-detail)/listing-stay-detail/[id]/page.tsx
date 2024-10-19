import React from 'react';
import { useRouter } from 'next/router';

const ListingStayDetailPage = ({
	params,
}: {
	params: { id: string };
}) => {
	const { id } = params;

	// const listing = getListingById(id);

	return <div>page</div>;
};

export default ListingStayDetailPage;
