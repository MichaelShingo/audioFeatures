import { Box, Stack } from '@mui/system';
import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';
import AudioUpload from '../audio/AudioUpload';
import { useTheme } from '@mui/material';

const PreUpload: React.FC = () => {
	const { state } = useAppState();
	const theme = useTheme();
	return (
		<>
			<Stack
				alignItems="center"
				justifyContent="center"
				direction="column"
				sx={{
					width: '100%',
					height: '100%',
					backgroundColor: '',
					display:
						(state.isUploading && !state.isUploaded) || state.isUploaded
							? 'none'
							: 'flex',
				}}
			>
				{state.errorState !== '' && (
					<Typography
						variant="h6"
						sx={{
							textAlign: 'center',
							mb: '9px',
							color: theme.palette.common.brightRed,
							backgroundColor: theme.palette.common.darkRed,
							paddingBlock: '5px',
							paddingInline: '13px',
							borderRadius: '20px',
						}}
					>
						{state.errorState}
					</Typography>
				)}
				<Typography
					sx={{
						textAlign: 'center',
						marginBottom: '25px',
						width: '100%',
					}}
					variant="h3"
				>
					Upload audio
				</Typography>
				<Box sx={{ transform: 'scale(250%)', zIndex: 50, pointerEvents: 'all' }}>
					<AudioUpload />
				</Box>
			</Stack>
			<Box
				sx={{
					width: '50%',
					height: '100%',
					backgroundColor: '',
					transform: 'translateY(50%)',
					marginInline: 'auto',
					display: state.isUploading ? 'block' : 'none',
				}}
			>
				<LinearProgress />
				<Typography variant="h4" sx={{ mt: '10px', textAlign: 'center', width: '100%' }}>
					{state.loadingState}
				</Typography>
			</Box>
		</>
	);
};

export default PreUpload;
