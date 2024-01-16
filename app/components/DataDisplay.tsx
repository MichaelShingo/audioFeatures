import { Typography } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';

const DataDisplay: React.FC = () => {
	const { state, dispatch } = useAppState();
	// console.log(state.currentPCM);
	// return <Typography variant="h3">{state.currentPCM}</Typography>;
};

export default DataDisplay;
