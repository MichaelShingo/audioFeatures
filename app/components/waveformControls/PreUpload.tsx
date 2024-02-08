import { Box, Stack } from '@mui/system';
import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';

const PreUpload: React.FC = () => {
	const { state } = useAppState();

	return (
		<>
			<Stack
				alignItems="center"
				justifyContent="center"
				direction="column"
				sx={{
					width: '100%',
					backgroundColor: '',
					display:
						(state.isUploading && !state.isUploaded) || state.isUploaded
							? 'none'
							: 'block',
				}}
			>
				<Typography
					sx={{
						textAlign: 'center',
						marginBottom: '25px',
						width: '100%',
					}}
					variant="h4"
				>
					Upload audio or activate microphone.
				</Typography>
			</Stack>
			<Box
				sx={{
					width: '50%',
					marginInline: 'auto',
					display: state.isUploading ? 'block' : 'none',
				}}
			>
				<LinearProgress />
			</Box>
		</>
	);
};

export default PreUpload;
