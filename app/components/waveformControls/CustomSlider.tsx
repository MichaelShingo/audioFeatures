import { Slider, useTheme } from '@mui/material';

interface CustomSliderProps {
	isDisabled?: boolean;
	min: number;
	max: number;
	value: number;
	handleChange: (event: Event, newValue: number | number[]) => void;
	display?: string;
}
const CustomSlider: React.FC<CustomSliderProps> = ({
	isDisabled = false,
	min,
	max,
	value,
	handleChange,
	display = 'block',
}) => {
	const theme = useTheme();
	return (
		<Slider
			disabled={isDisabled}
			min={min}
			max={max}
			size="small"
			valueLabelDisplay="auto"
			aria-label="zoom"
			value={value}
			onChange={handleChange}
			valueLabelFormat={(value: number) => `${value}%`}
			sx={{
				display: display,
				'& .MuiSlider-thumb': {
					borderRadius: '3px',
				},
				'& .Mui-disabled': {
					color: theme.palette.common.maroon,
				},
				'& .MuiSlider-rail': {
					color: isDisabled ? theme.palette.common.maroon : theme.palette.primary.light,
				},
				'& .MuiSlider-track': {
					color: isDisabled ? theme.palette.common.maroon : theme.palette.primary.light,
				},
				'&:disabled': {
					backgroundColor: theme.palette.common.maroon,
				},
			}}
		/>
	);
};

export default CustomSlider;
