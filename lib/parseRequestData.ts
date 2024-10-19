import { NextRequest } from 'next/server';

export async function parseRequestData(
	req: NextRequest
): Promise<Record<string, any>> {
	let combinedParams: Record<string, any> = {};

	// Get URL search params
	const searchParams = req.nextUrl.searchParams;
	searchParams.forEach((value, key) => {
		combinedParams[key] = value;
	});

	// Check content type
	const contentType = req.headers.get('content-type');

	if (contentType?.includes('application/json')) {
		// Parse JSON body
		try {
			const jsonBody = await req.json();
			combinedParams = { ...combinedParams, ...jsonBody };
		} catch (error) {
			console.error('Error parsing JSON body:', error);
		}
	} else if (
		contentType?.includes('application/x-www-form-urlencoded')
	) {
		// Parse URL-encoded form data
		try {
			const formData = await req.text();
			const urlParams = new URLSearchParams(formData);
			urlParams.forEach((value, key) => {
				combinedParams[key] = value;
			});
		} catch (error) {
			console.error('Error parsing URL-encoded form data:', error);
		}
	} else if (contentType?.includes('multipart/form-data')) {
		// Parse multipart form data
		try {
			const formData = await req.formData();
			formData.forEach((value, key) => {
				combinedParams[key] = value;
			});
		} catch (error) {
			console.error('Error parsing multipart form data:', error);
		}
	}

	// if (combinedParams?.include && combinedParams?.include.length > 0) {
	// 	//include the fields
	// 	combinedParams.include = combinedParams.include.split(',');
	// }

	//if combinedParams?.include and combinedParams?.include is not an array, split the string
	if (
		combinedParams?.include &&
		typeof combinedParams?.include !== 'object'
	) {
		combinedParams.include = combinedParams.include.split(',');
	} else {
		combinedParams.include = ['*'];
	}

	return combinedParams;
}
