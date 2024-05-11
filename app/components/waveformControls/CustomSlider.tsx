import { Slider, SliderOwnProps, useTheme } from '@mui/material';

interface CustomSliderProps {
	isDisabled?: boolean;
	min: number;
	max: number;
	value: number;
	handleChange: (event: Event, newValue: number | number[]) => void;
	display?: string;
	labelDisplay?: SliderOwnProps['valueLabelDisplay'];
}
const CustomSlider: React.FC<CustomSliderProps> = ({
	isDisabled = false,
	min,
	max,
	value,
	handleChange,
	display = 'block',
	labelDisplay = 'auto',
}) => {
	const theme = useTheme();
	return (
		<Slider
			disabled={isDisabled}
			min={min}
			max={max}
			size="small"
			valueLabelDisplay={labelDisplay}
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
				'.MuiSlider-valueLabel': {
					backgroundColor: theme.palette.common.darkRed,
				},
				'&:disabled': {
					backgroundColor: theme.palette.common.maroon,
				},
			}}
		/>
	);
};

export default CustomSlider;
