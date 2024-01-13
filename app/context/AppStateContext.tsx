import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { Loudness, PitchData, SpectralFlatness } from '../data/constants';
import { calculateMilliseconds, calculateSeconds } from '../utils/timecodeCalculations';

export const H_BREAKPOINT = 440;
export const SETTINGS_ROW_SPACING: string = '10px';

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
};

export type AppAction = {
	type: string;
	payload?:
		| string
		| number
		| File
		| Float32Array
		| PitchData
		| Loudness[]
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
				minutes: state.minutes + timecode.minutes,
				seconds: timecode.seconds,
			};
		}
		case actions.SET_MILLISECONDS: {
			const timecode = calculateMilliseconds(action.payload as number);
			return {
				...state,
				minutes: state.minutes + timecode.minutes,
				seconds: state.seconds + timecode.seconds,
				milliseconds: timecode.milliseconds,
			};
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
