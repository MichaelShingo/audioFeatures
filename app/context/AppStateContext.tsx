import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { Loudness, PitchData, SpectralFlatness } from '../data/constants';
import {
	Timecode,
	calculateMilliseconds,
	calculateSeconds,
} from '../utils/timecodeCalculations';

export const H_BREAKPOINT = 440;
export const SETTINGS_ROW_SPACING: string = '10px';

type MousePosition = {
	x: number;
	y: number;
};

interface GlobalState {
	dark_mode: boolean;
	settings_open: boolean;
	rms: number;
	audioFile: File | null;
	waveform: Float32Array | null;
	currentPCM: number;
	resizePosition: number;
	windowHeight: number;
	pitchData: PitchData;
	loudnessData: Loudness[];
	spectralFlatnessData: SpectralFlatness[];
	minutes: number;
	seconds: number;
	milliseconds: number;
	isHoveredWaveform: boolean;
	markerPosition: number;
	timecode: Timecode;
	audioBuffer: AudioBuffer | null;
	isPlaying: boolean;
	currentTime: number;
	isUploaded: boolean;
	isUploading: boolean;
	mousePosition: MousePosition;
	isSeekHandleHovered: boolean;
	waveformWidth: number;
	wavelengthLength: number;
	audioDuration: number;
}

const initialState: GlobalState = {
	dark_mode: true,
	settings_open: false,
	rms: 20,
	audioFile: null,
	waveform: null,
	currentPCM: 0,
	resizePosition: 500,
	windowHeight: 1000,
	pitchData: [],
	loudnessData: [],
	spectralFlatnessData: [],
	minutes: 0,
	seconds: 0,
	milliseconds: 0,
	isHoveredWaveform: false,
	markerPosition: 0,
	timecode: { minutes: 0, seconds: 0, milliseconds: 0 },
	audioBuffer: null,
	isPlaying: false,
	currentTime: 0,
	isUploaded: false,
	isUploading: false,
	mousePosition: { x: 0, y: 0 },
	isSeekHandleHovered: false,
	waveformWidth: 0,
	wavelengthLength: 0,
	audioDuration: 0,
};

export type AppAction = {
	type: string;
	payload?:
		| string
		| number
		| MousePosition
		| File
		| Float32Array
		| PitchData
		| Loudness[]
		| boolean
		| Timecode
		| AudioBuffer
		| SpectralFlatness[];
};

interface AppStateContextType {
	state: GlobalState;
	dispatch: Dispatch<AppAction>;
}

export const actions: Record<string, string> = {
	DARK_MODE: 'DARK_MODE',
	SETTINGS_OPEN: 'SETTINGS_OPEN',
	SET_RMS: 'SET_RMS',
	SET_AUDIO_FILE: 'SET_AUDIO_FILE',
	SET_WAVEFORM: 'SET_WAVEFORM',
	SET_CURRENT_PCM: 'SET_CURRENT_PCM',
	SET_RESIZE_POSITION: 'SET_RESIZE_POSITION',
	SET_WINDOW_HEIGHT: 'SET_WINDOW_HEIGHT',
	SET_PITCH_DATA: 'SET_PITCH_DATA',
	SET_LOUDNESS_DATA: 'SET_LOUDNESS_DATA',
	SET_SPECTRAL_FLATNESS_DATA: 'SET_SPECTRAL_FLATNESS_DATA',
	SET_MINUTES: 'SET_MINUTES',
	SET_SECONDS: 'SET_SECONDS',
	SET_MILLISECONDS: 'SET_MILLISECONDS',
	SET_IS_HOVERED_WAVEFORM: 'SET_IS_HOVERED_WAVEFORM',
	SET_MARKER_POSITION: 'SET_MARKER_POSITION',
	SET_TIMECODE: 'SET_TIMECODE',
	SET_AUDIO_BUFFER: 'SET_AUDIO_BUFFER',
	SET_IS_PLAYING: 'SET_IS_PLAYING',
	SET_IS_UPLOADED: 'SET_IS_UPLOADED',
	SET_IS_UPLOADING: 'SET_IS_UPLOADING',
	SET_MOUSE_POSITION: 'SET_MOUSE_POSITION',
	SET_IS_SEEK_HANDLE_HOVERED: 'SET_IS_SEEK_HANDLE_HOVERED',
	SET_WAVEFORM_WIDTH: 'SET_WAVEFORM_WIDTH',
	SET_WAVELENGTH_LENGTH: 'SET_WAVELENGTH_LENGTH',
	SET_AUDIO_DURATION: 'SET_AUDIO_DURATION',
};

const appReducer = (state: GlobalState, action: AppAction): GlobalState => {
	switch (action.type) {
		case actions.SETTINGS_OPEN:
			return { ...state, settings_open: !state.settings_open };
		case actions.SET_RMS:
			return { ...state, rms: action.payload as number };
		case actions.SET_AUDIO_FILE:
			return { ...state, audioFile: action.payload as File };
		case actions.SET_WAVEFORM:
			return { ...state, waveform: action.payload as Float32Array };
		case actions.SET_CURRENT_PCM:
			return { ...state, currentPCM: action.payload as number };
		case actions.SET_RESIZE_POSITION:
			return { ...state, resizePosition: action.payload as number };
		case actions.SET_WINDOW_HEIGHT:
			return { ...state, windowHeight: action.payload as number };
		case actions.SET_PITCH_DATA:
			return { ...state, pitchData: action.payload as PitchData };
		case actions.SET_LOUDNESS_DATA:
			return { ...state, loudnessData: action.payload as Loudness[] };
		case actions.SET_SPECTRAL_FLATNESS_DATA:
			return { ...state, spectralFlatnessData: action.payload as SpectralFlatness[] };
		case actions.SET_MINUTES:
			return { ...state, minutes: action.payload as number };
		case actions.SET_SECONDS: {
			const timecode = calculateSeconds(action.payload as number);
			return {
				...state,
				minutes:
					timecode.minutes > 0
						? (state.minutes as number) + (timecode.minutes as number)
						: state.minutes,
				seconds: timecode.seconds,
			};
		}
		case actions.SET_MILLISECONDS: {
			const timecode = calculateMilliseconds(action.payload as number);
			return {
				...state,
				minutes: timecode.minutes > 0 ? state.minutes + timecode.minutes : state.minutes,
				seconds: timecode.seconds > 0 ? state.seconds + timecode.seconds : state.seconds,
				milliseconds: timecode.milliseconds,
			};
		}
		case actions.SET_IS_HOVERED_WAVEFORM:
			return { ...state, isHoveredWaveform: !state.isHoveredWaveform };
		case actions.SET_MARKER_POSITION:
			return { ...state, markerPosition: action.payload as number };
		case actions.SET_TIMECODE:
			return { ...state, timecode: { minutes: 0, seconds: 0, milliseconds: 0 } };
		case actions.SET_AUDIO_BUFFER:
			return { ...state, audioBuffer: action.payload as AudioBuffer };

		case actions.SET_IS_PLAYING:
			return { ...state, isPlaying: action.payload as boolean };

		case actions.SET_IS_UPLOADED:
			return { ...state, isUploaded: action.payload as boolean };
		case actions.SET_IS_UPLOADING:
			return { ...state, isUploading: action.payload as boolean };
		case actions.SET_MOUSE_POSITION:
			return { ...state, mousePosition: action.payload as MousePosition };
		case actions.SET_IS_SEEK_HANDLE_HOVERED:
			return { ...state, isSeekHandleHovered: action.payload as boolean };
		case actions.SET_WAVEFORM_WIDTH:
			return { ...state, waveformWidth: action.payload as number };
		case actions.SET_WAVELENGTH_LENGTH:
			return { ...state, wavelengthLength: action.payload as number };
		case actions.SET_AUDIO_DURATION:
			return { ...state, audioDuration: action.payload as number };
		default:
			return state;
	}
};

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface Props {
	children: React.ReactNode;
}

const AppStateProvider: React.FC<Props> = ({ children }) => {
	// useReducer returns the current state and a dispatch function
	const [state, dispatch] = useReducer(appReducer, initialState);

	return (
		<AppStateContext.Provider value={{ state, dispatch }}>
			{children}
		</AppStateContext.Provider>
	);
};

export const useAppState = (): AppStateContextType => {
	const context = useContext(AppStateContext);
	if (!context) {
		throw new Error('useAppState must be used within an AppStateProvider');
	}
	return context;
};

export default AppStateProvider;
