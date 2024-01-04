import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Box, Tooltip } from '@mui/material';
import DroneSettings from './DroneSettings';
import React from 'react';
import { iconStyles } from './Drone';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';
import { H_BREAKPOINT, actions, useAppState } from '../context/AppStateContext';
import MetroSettings from './MetroSettings';
import DialogContainer from './DialogContainer';

export const SELECT_MARGIN = '10px';

const Settings: React.FC = () => {
	const { state, dispatch } = useAppState();

	// const darkMode: boolean = state.dark_mode;
	const handleSettingsToggle = () => dispatch({ type: actions.SETTINGS_OPEN });
	// const handleModeToggle = () => {
	// 	dispatch({ type: actions.DARK_MODE });
	// };

	return (
		<Box sx={{ width: 'fit-content', height: '100%' }}>
			<Tooltip title="Settings (S)" placement="left">
				<IconButton
					onClick={handleSettingsToggle}
					sx={{
						width: 'fit-content',
						height: '100%',
						color: 'grey.300',
						padding: state.window_height < H_BREAKPOINT ? '0px' : '10px',
					}}
				>
					<SettingsIcon sx={iconStyles} />
				</IconButton>
			</Tooltip>
			<DialogContainer
				title="Settings"
				open={state.settings_open}
				handleToggle={handleSettingsToggle}
			>
				<MetroSettings />
				<DroneSettings />
			</DialogContainer>
		</Box>
	);
};

export default Settings;
