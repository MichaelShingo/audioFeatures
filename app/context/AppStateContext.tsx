import React, { createContext, useReducer, useContext, Dispatch } from 'react';

export const H_BREAKPOINT = 440;
export const SETTINGS_ROW_SPACING: string = '10px';

interface GlobalState {
	dark_mode: boolean;
	settings_open: boolean;
	rms: number;
}
const initialState: GlobalState = {
	dark_mode: true,
	settings_open: false,
	rms: 20,
};

export type AppAction = { type: string; payload?: string | number };

interface AppStateContextType {
	state: GlobalState;
	dispatch: Dispatch<AppAction>;
}

export const actions: Record<string, string> = {
	DARK_MODE: 'DARK_MODE',
	SETTINGS_OPEN: 'SETTINGS_OPEN',
	SET_RMS: 'SET_RMS',
};

const appReducer = (state: GlobalState, action: AppAction): GlobalState => {
	switch (action.type) {
		case actions.SETTINGS_OPEN:
			return { ...state, settings_open: !state.settings_open };
		case actions.SET_RMS:
			return { ...state, rms: action.payload as number}
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
