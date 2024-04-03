import DraggableSelection from './DraggableSelection';
import { useAppState } from '../../context/AppStateContext';
import { useEffect, useState } from 'react';
import HoverMarker from './HoverMarker';
import SeekHandle from './SeekHandle';

const WaveformSVG = () => {
	const { state } = useAppState();
	const [svgPathData, setSVGPathData] = useState<string>('');

	useEffect(() => {
		const generateWaveform = (): void => {
			if (!state.waveform) {
				return;
			}

			const loudnessDataLength: number = state.loudnessData.length;
			let newSVGData = 'M0 530,';

			for (let i = 0; i < loudnessDataLength; i++) {
				const loudnessTotal = getLoudnessTotal(i);
				newSVGData += createSVGCoordinate(i, loudnessTotal, 100);
			}

			for (let i = loudnessDataLength - 1; i >= 0; i--) {
				let loudnessTotal: number | undefined = getLoudnessTotal(i);
				loudnessTotal = loudnessTotal ? loudnessTotal * -1 : -5;
				newSVGData += createSVGCoordinate(i, loudnessTotal, 109.5);
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

	const createSVGCoordinate = (
		x: number,
		y: number | undefined,
		offset: number
	): string => {
		let yValue: number | undefined = y;
		const scale: number = 5;
		yValue = y ? y + offset : offset + 4.65;
		yValue = Math.abs(yValue);
		return `L${x} ${Math.round(yValue * scale)}, `;
	};

	const calcVerticalScalePercentage = (): number | undefined => {
		if (state.isDragging) {
			return state.mousePosition.y / 10;
		} else {
			return 67.9;
		}
	};

	const calcStrokeWidth = (): number => {
		if (state.zoomFactor < 0.5) {
			return 0.6;
		}
		return 1 / state.zoomFactor + 0.1;
	};

	return (
		<div
			style={{
				backgroundColor: '',
				transform: `scaleY(${state.windowHeight / 7}%) translateY(-${
					40 + state.windowHeight / 120
				}%)`,
				pointerEvents: 'all',
				position: 'relative',
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="400px"
				width={`${state.loudnessData.length * state.zoomFactor}px`}
				viewBox={`0 0 ${state.loudnessData.length} 700`}
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
