import { IconButton, Tooltip } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { actions, useAppState } from '../context/AppStateContext';
import { Stack } from '@mui/system';

const iconStyles = {
	width: '100%',
	height: '100%',
};

const StartButton: React.FC = () => {
	const { state, dispatch } = useAppState();
	const on: boolean = state.metro_on;

	const handleClick = () => {
		dispatch({ type: actions.METRO_ON });
	};
	return (
		<>
			<Tooltip title="Play (P)">
				<Stack
					alignItems="center"
					sx={{
						backgroundColor: 'none',
						width: 'fit-content',
						height: state.polyrhythm !== '0' ? '28%' : '35%',
					}}
				>
					<IconButton
						sx={{ width: '100%', height: '100%', color: 'primary.light', padding: '0px' }}
						onClick={handleClick}
					>
						{on ? (
							<PauseCircleIcon sx={iconStyles} />
						) : (
							<PlayCircleIcon sx={iconStyles} />
						)}
					</IconButton>
				</Stack>
			</Tooltip>
		</>
	);
};

export default StartButton;
