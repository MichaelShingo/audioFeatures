import React, { createContext, useReducer, useContext, Dispatch } from 'react';

export const H_BREAKPOINT = 440;
export const SETTINGS_ROW_SPACING: string = '10px';

interface GlobalState {
	dark_mode: boolean;
	settings_open: boolean;
	rms: number;
	audioFile: File | null;
	waveform: Float32Array | null;
}
const initialState: GlobalState = {
	dark_mode: true,
	settings_open: false,
	rms: 20,
	audioFile: null,
	waveform: null,
};

export type AppAction = { type: string; payload?: string | number | File | Float32Array };

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
