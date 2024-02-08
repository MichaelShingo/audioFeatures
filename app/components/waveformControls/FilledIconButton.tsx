import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactElement } from 'react';
import { useTheme } from '@mui/material';

interface FilledIconButtonProps {
	icon: ReactElement;
	onClickHandler: (e: React.MouseEvent<HTMLElement>) => void;
	isActive: boolean;
}

const iconButtonStyles = {
	zIndex: '1',
	backgroundColor: 'red',
};

const FilledIconButton: React.FC<FilledIconButtonProps> = ({
	onClickHandler,
	icon,
	isActive,
}) => {
	const theme = useTheme();
	const disabledClick = () => {};

	return (
		<Box
			onClick={isActive ? onClickHandler : disabledClick}
			sx={{
				backgroundColor: isActive
					? theme.palette.common.brightRed
					: theme.palette.common.mediumGrey,
				borderRadius: '50%',
				marginInline: '5px',
			}}
		>
			<IconButton disabled={!isActive} sx={{ iconButtonStyles }}>
				{icon}
			</IconButton>
		</Box>
	);
};

export default FilledIconButton;
