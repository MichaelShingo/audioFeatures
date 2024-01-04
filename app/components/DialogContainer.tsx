import {
	DialogTitle,
	Dialog,
	Typography,
	Stack,
	DialogContent,
	IconButton,
	useMediaQuery,
	Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MouseEvent, ReactNode, useState } from 'react';
import { DialogProps } from '@mui/material';

interface DialogContainerProps {
	title: string;
	open: boolean;
	handleToggle: (event: MouseEvent<HTMLButtonElement>) => void;
	children: ReactNode;
}

const DialogContainer: React.FC<DialogContainerProps> = ({
	title,
	open,
	handleToggle,
	children,
}) => {
	const [scroll] = useState<DialogProps['scroll']>('paper');
	const isSmallScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
	return (
		<Dialog
			open={open}
			keepMounted
			onClose={handleToggle}
			maxWidth="xs"
			scroll={scroll}
			fullWidth={true}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
			sx={{ paper: 'primary.dark' }}
		>
			<DialogTitle sx={{ backgroundColor: 'background.default' }}>
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="h4">{title}</Typography>
					<IconButton
						size="small"
						onClick={handleToggle}
						sx={{ width: isSmallScreen ? '15%' : '10%', height: '10%' }}
					>
						<CloseIcon sx={{ width: '100%', height: '100%' }} />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent sx={{ backgroundColor: 'background.default' }}>
				{children}
			</DialogContent>
		</Dialog>
	);
};

export default DialogContainer;
