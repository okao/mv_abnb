'use client';

import Button, { ButtonProps } from './Button';
import React from 'react';

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
	className = ' ',
	...args
}) => {
	return (
		<Button
			className={`ttnc-ButtonSecondary font-medium border bg-white border-neutral-200 text-neutral-700 dark:bg-gray-900 dark:text-neutral-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
			{...args}
		/>
	);
};

export default ButtonSecondary;
