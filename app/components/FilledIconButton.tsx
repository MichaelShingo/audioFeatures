import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactElement } from 'react';
import { useTheme } from '@mui/material';

interface FilledIconButtonProps {
	icon: ReactElement;
}
const iconButtonStyles = {
	zIndex: '1',
};

const FilledIconButton: React.FC<FilledIconButtonProps> = ({ icon }) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				borderRadius: '50%',
				marginInline: '5px',
			}}
		>
			<IconButton sx={{ iconButtonStyles }}>{icon}</IconButton>
		</Box>
	);
};

export default FilledIconButton;
