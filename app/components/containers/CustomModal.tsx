import { IconButton, Modal, useTheme } from '@mui/material';
import { Box, Stack } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import React, { ReactNode, SetStateAction } from 'react';

interface CustomModalProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}
const CustomModal: React.FC<CustomModalProps> = ({ isOpen, setIsOpen, children }) => {
	const theme = useTheme();

	return (
		<Modal
			open={isOpen}
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transform: 'translateX(-50%) translateY(0%)',
				mt: '20%',
				borderRadius: '1%',
				ml: '50%',
				mr: '50%',
				p: '15px',
				height: 'fit-content',
				width: '80vw',
				maxWidth: '500px',
				backgroundColor: theme.palette.common.darkGrey,
				border: `2px solid ${theme.palette.common.lightBlueTrans}`,
				color: 'white',
			}}
		>
			<Stack sx={{ height: '100%', width: '100%' }} direction="column">
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'right',
						alignItems: 'center',
						height: '20%',
						width: '100%',
						backgroundColor: '',
					}}
				>
					<IconButton
						onClick={() => {
							setIsOpen((prevIsOpen) => !prevIsOpen);
							console.log('setting to false');
						}}
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '80%',
						backgroundColor: '',
					}}
				>
					{children}
				</Box>
			</Stack>
		</Modal>
	);
};

export default CustomModal;
