import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { Loudness, PitchData, SpectralFlatness } from '../data/constants';
import { Timecode, roundSeconds } from '../utils/timecodeCalculations';

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
	windowWidth: number;
	windowHeight: number;
	pitchData: PitchData;
	loudnessData: Loudness[];
	spectralFlatnessData: SpectralFlatness[];
	seconds: number;
	isHoveredWaveform: boolean;
	timecode: Timecode;
	audioBuffer: AudioBuffer | null;
	isPlaying: boolean;
	currentTime: number;
	isUploaded: boolean;
	isUploading: boolean;
	mousePosition: MousePosition;
	waveformWidth: number;
	wavelengthLength: number;
	audioDuration: number;
	isDragging: boolean;
	waveformScrollPosition: number;
	seekHandleMouseDown: boolean;
}

const initialState: GlobalState = {
	dark_mode: true,
	settings_open: false,
	rms: 20,
	audioFile: null,
	waveform: null,
	currentPCM: 0,
	resizePosition: 500,
	windowWidth: 2000,
	windowHeight: 1000,
	pitchData: [],
	loudnessData: [],
	spectralFlatnessData: [],
	seconds: 0,
	isHoveredWaveform: false,
	timecode: { minutes: 0, seconds: 0, milliseconds: 0 },
	audioBuffer: null,
	isPlaying: false,
	currentTime: 0,
	isUploaded: false,
	isUploading: false,
	mousePosition: { x: 0, y: 0 },
	waveformWidth: 0,
	wavelengthLength: 0,
	audioDuration: 0,
	isDragging: false,
	waveformScrollPosition: 0,
	seekHandleMouseDown: false,
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
	SET_WINDOW_WIDTH: 'SET_WINDOW_WIDTH',
	SET_WINDOW_HEIGHT: 'SET_WINDOW_HEIGHT',
	SET_PITCH_DATA: 'SET_PITCH_DATA',
	SET_LOUDNESS_DATA: 'SET_LOUDNESS_DATA',
	SET_SPECTRAL_FLATNESS_DATA: 'SET_SPECTRAL_FLATNESS_DATA',
	SET_SECONDS: 'SET_SECONDS',
	SET_IS_HOVERED_WAVEFORM: 'SET_IS_HOVERED_WAVEFORM',
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
	SET_IS_DRAGGING: 'SET_IS_DRAGGING',
	SET_WAVEFORM_SCROLL_POSITION: 'SET_WAVEFORM_SCROLL_POSITION',
	SET_SEEK_HANDLE_MOUSE_DOWN: 'SET_SEEK_HANDLE_MOUSE_DOWN',
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
		case actions.SET_WINDOW_WIDTH:
			return { ...state, windowWidth: action.payload as number };
		case actions.SET_PITCH_DATA:
			return { ...state, pitchData: action.payload as PitchData };
		case actions.SET_LOUDNESS_DATA:
			return { ...state, loudnessData: action.payload as Loudness[] };
		case actions.SET_SPECTRAL_FLATNESS_DATA:
			return { ...state, spectralFlatnessData: action.payload as SpectralFlatness[] };
		case actions.SET_SECONDS: {
			let seconds: number = action.payload as number;
			seconds = seconds < 0 ? 0 : seconds;
			seconds = seconds > state.audioDuration ? state.audioDuration : seconds;
			return { ...state, seconds: roundSeconds(seconds) };
		}
		case actions.SET_IS_HOVERED_WAVEFORM:
			return { ...state, isHoveredWaveform: !state.isHoveredWaveform };
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

		case actions.SET_WAVEFORM_WIDTH:
			return { ...state, waveformWidth: action.payload as number };
		case actions.SET_WAVELENGTH_LENGTH:
			return { ...state, wavelengthLength: action.payload as number };
		case actions.SET_AUDIO_DURATION:
			return { ...state, audioDuration: action.payload as number };
		case actions.SET_IS_DRAGGING:
			return { ...state, isDragging: action.payload as boolean };
		case actions.SET_WAVEFORM_SCROLL_POSITION: {
			return { ...state, waveformScrollPosition: action.payload as number };
		}
		case actions.SET_SEEK_HANDLE_MOUSE_DOWN: {
			return { ...state, seekHandleMouseDown: action.payload as boolean };
		}
		case actions.SET_GLOBAL_MOUSE_UP: {
			return { ...state, seekHandleMouseDown: false };
		}

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
