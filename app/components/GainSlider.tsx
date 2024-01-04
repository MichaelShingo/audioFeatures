import { Slider, Typography } from '@mui/material';
import { Stack } from '@mui/system';

interface GainSliderProps {
	title: string;
	gain: number;
	handleGainChange: (event: Event, value: number | number[]) => void;
}
const GainSlider: React.FC<GainSliderProps> = ({ title, gain, handleGainChange }) => {
	return (
		<Stack direction="column" sx={{ width: '50%' }}>
			<Typography variant="subtitle1">{title}</Typography>
			<Slider
				sx={{ width: '85%', mt: '4px', ml: '4px' }}
				min={0}
				max={100}
				valueLabelDisplay="auto"
				aria-label={title}
				value={gain}
				onChange={handleGainChange}
				size="medium"
			/>
		</Stack>
	);
};

export default GainSlider;
