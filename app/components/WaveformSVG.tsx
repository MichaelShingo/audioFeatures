import DraggableSelection from './DraggableSelection';
import { useAppState } from '../context/AppStateContext';
import { useEffect, useState } from 'react';

const WaveformSVG = () => {
	const { state } = useAppState();
	const [svgPathData, setSVGPathData] = useState<string>('');

	useEffect(() => {
		const generateWaveform = (): void => {
			if (!state.waveform) {
				return;
			}

			const loudnessDataLength: number = state.loudnessData.length;
			let newSVGData = 'M0 500,';

			for (let i = 0; i < loudnessDataLength; i++) {
				newSVGData += createSVGCoordinate(i, getLoudnessTotal(i));
			}

			for (let i = loudnessDataLength - 1; i >= 0; i--) {
				let loudnessTotal: number | undefined = getLoudnessTotal(i);
				loudnessTotal = loudnessTotal ? loudnessTotal * -1 : 0;
				newSVGData += createSVGCoordinate(i, loudnessTotal);
			}

			setSVGPathData(newSVGData);
		};

		const getLoudnessTotal = (index: number): number | undefined => {
			return state.loudnessData[index]?.total;
		};

		if (!state.isUploading) {
			generateWaveform();
		}
	}, [state.isUploading, state.loudnessData, state.waveform]);

	const calcVerticalScalePercentage = (): number | undefined => {
		if (state.isDragging) {
			return state.mousePosition.y / 5;
		}
	};

	const calcStrokeWidth = (): number => {
		if (state.zoomFactor < 0.5) {
			return 0.6;
		}
		return 1 / state.zoomFactor + 0.1;
	};

	const createSVGCoordinate = (x: number, y: number | undefined): string => {
		let yValue: number | undefined = y;
		const offset: number = 100;
		const scale: number = 5;
		yValue = y ? y + offset : offset;
		return `L${x} ${Math.round(yValue * scale)}, `;
	};

	return (
		<div
			style={{
				backgroundColor: '',
				transform: `scaleY(${calcVerticalScalePercentage()}%)`,
				pointerEvents: 'none',
				position: 'relative',
			}}
		>
			<DraggableSelection />
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="1000px"
				width={`${state.loudnessData.length * state.zoomFactor}px`}
				viewBox={`0 0 ${state.loudnessData.length} 1000`}
				preserveAspectRatio="none"
			>
				<g fill="#3498db" stroke="#3498db" strokeWidth={calcStrokeWidth()}>
					<path d={svgPathData} fillOpacity="0.3" />
				</g>
			</svg>
		</div>
	);
};

export default WaveformSVG;
