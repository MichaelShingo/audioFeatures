import { IconButton, Modal, Slider, useTheme } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';

const SettingsContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const theme = useTheme();

	return (
		<IconButton
			onClick={() => setIsModalOpen(true)}
			sx={{
				position: 'fixed',
				top: '0px',
				right: '0px',
			}}
		>
			<TuneIcon />
			<Modal
				open={isModalOpen}
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
					height: '100px',
					width: '80vw',
					backgroundColor: theme.palette.common.darkGrey,
					border: `2px solid ${theme.palette.common.lightBlueTrans}`,
				}}
			>
				<>
					<Slider />
					<Slider />
				</>
			</Modal>
		</IconButton>
	);
};

export default SettingsContainer;
