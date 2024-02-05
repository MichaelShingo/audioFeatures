import { useTheme } from '@mui/material';
import React from 'react';
import { useAppState } from '../context/AppStateContext';

interface TimecodeInputProps {
	refObj: React.RefObject<HTMLInputElement>;
	handleBlur: () => void;
	handleFocus: () => void;
}

const TimecodeInput: React.FC<TimecodeInputProps> = ({
	refObj,
	handleBlur,
	handleFocus,
}) => {
	const { state } = useAppState();
	const theme = useTheme();

	const inputStyle = {
		backgroundColor: theme.palette.common.mediumGrey,
		color: 'white',
		fontFamily: theme.typography.fontFamily,
		fontSize: '30px',
		width: '50px',
		margin: '0',
		padding: '0',
		border: '0',
		borderRadius: '10px',
		textAlign: 'center' as const,
	};

	const handleOnKeyDown = (key: string): void => {
		if (key === 'Enter') {
			refObj.current?.blur();
		}
	};

	return (
		<input
			disabled={!state.isUploaded}
			step="1"
			ref={refObj}
			type="number"
			style={inputStyle}
			onBlur={handleBlur}
			onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOnKeyDown(e.key)}
			onFocus={handleFocus}
		/>
	);
};

export default TimecodeInput;
