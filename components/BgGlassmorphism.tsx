import React, { FC } from 'react';

export interface BgGlassmorphismProps {
	className?: string;
}

const BgGlassmorphism: FC<BgGlassmorphismProps> = ({
	className = 'absolute inset-x-0 md:top-10 xl:top-40 min-h-0 pl-20 py-24 flex overflow-hidden z-0',
}) => {
	return (
		<div
			className={`nc-BgGlassmorphism ${className}`}
			data-nc-id="BgGlassmorphism"
		>
			<span className="block bg-[#b30505] w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 lg:w-[200px] lg:h-[200px]"></span>
			<span className="block bg-[#d83706] w-72 h-72 -ml-20 mt-40 rounded-full mix-blend-multiply filter blur-3xl opacity-10 lg:w-[200px] lg:h-[200px] nc-animation-delay-2000"></span>
		</div>
	);
};

export default BgGlassmorphism;
