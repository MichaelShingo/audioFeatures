import React, {
	createContext,
	useReducer,
	useContext,
	Dispatch,
	MutableRefObject,
} from 'react';
import { Loudness, PitchData, SpectralFlatness } from '../data/constants';
import { Timecode, roundSeconds } from '../utils/timecodeCalculations';
import { Midi } from '@tonejs/midi';
import { Chord } from '../utils/parseAudioSlice';

export const H_BREAKPOINT = 440;
export const SETTINGS_ROW_SPACING: string = '10px';

type MousePosition = {
	x: number;
	y: number;
};

interface GlobalState {
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
	wavelengthLength: number;
	audioDuration: number;
	isDragging: boolean;
	waveformScrollPosition: number;
	seekHandleMouseDown: boolean;
	zoomFactor: number;
	selectionStartSeconds: number;
	selectionEndSeconds: number;
	globalMouseUp: boolean;
	isDraggingSelectionHandleRight: boolean;
	isDraggingSelectionHandleLeft: boolean;
	midiData: Midi | null;
	waveformContainerWidth: number;
	seekHandleContainerRef: MutableRefObject<HTMLDivElement | null> | null;
	audioVolume: number;
	chordVolume: number;
	chords: Chord[];
	midiFile: ReadableStream<Uint8Array> | null;
	loadingState: string;
	errorState: string;
}

const initialState: GlobalState = {
	rms: 20,
	audioFile: null,
	waveform: null,
	currentPCM: 0,
	resizePosition: 679,
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
	wavelengthLength: 0,
	audioDuration: 0,
	isDragging: false,
	waveformScrollPosition: 0,
	seekHandleMouseDown: false,
	zoomFactor: 1,
	selectionStartSeconds: 0,
	selectionEndSeconds: 0,
	globalMouseUp: true,
	isDraggingSelectionHandleRight: false,
	isDraggingSelectionHandleLeft: false,
	midiData: null,
	waveformContainerWidth: 0,
	seekHandleContainerRef: null,
	audioVolume: 100,
	chordVolume: 100,
	chords: [],
	midiFile: null,
	loadingState: '',
	errorState: '',
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
		| SpectralFlatness[]
		| MutableRefObject<HTMLDivElement | null>
		| Chord[]
		| Midi
		| ReadableStream<Uint8Array>
		| null;
};

interface AppStateContextType {
	state: GlobalState;
	dispatch: Dispatch<AppAction>;
}

export const actions: Record<string, string> = {
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
	SET_WAVELENGTH_LENGTH: 'SET_WAVELENGTH_LENGTH',
	SET_AUDIO_DURATION: 'SET_AUDIO_DURATION',
	SET_IS_DRAGGING: 'SET_IS_DRAGGING',
	SET_WAVEFORM_SCROLL_POSITION: 'SET_WAVEFORM_SCROLL_POSITION',
	SET_SEEK_HANDLE_MOUSE_DOWN: 'SET_SEEK_HANDLE_MOUSE_DOWN',
	SET_ZOOM_FACTOR: 'SET_ZOOM_FACTOR',
	SET_SELECTION_START_SECONDS: 'SET_SELECTION_START_SECONDS',
	SET_SELECTION_END_SECONDS: 'SET_SELECTION_END_SECONDS',
	SET_GLOBAL_MOUSE_UP: 'SET_GLOBAL_MOUSE_UP',
	SET_IS_DRAGGING_SELECTION_HANDLE_RIGHT: 'SET_IS_DRAGGING_SELECTION_HANDLE_RIGHT',
	SET_IS_DRAGGING_SELECTION_HANDLE_LEFT: 'SET_IS_DRAGGING_SELECTION_HANDLE_LEFT',
	SET_MIDI_DATA: 'SET_MIDI_DATA',
	SET_WAVEFORM_CONTAINER_WIDTH: 'SET_WAVEFORM_CONTAINER_WIDTH',
	SET_SEEK_HANDLE_CONTAINER_REF: 'SET_SEEK_HANDLE_CONTAINER_REF',
	SET_AUDIO_VOLUME: 'SET_AUDIO_VOLUME',
	SET_CHORD_VOLUME: 'SET_CHORD_VOLUME',
	SET_CHORDS: 'SET_CHORDS',
	SET_MIDI_FILE: 'SET_MIDI_FILE',
	SET_LOADING_STATE: 'SET_LOADING_STATE',
	SET_ERROR_STATE: 'SET_ERROR_STATE',
};

const appReducer = (state: GlobalState, action: AppAction): GlobalState => {
	switch (action.type) {
		case actions.SET_RMS:
			return { ...state, rms: action.payload as number };
		case actions.SET_AUDIO_FILE:
			return { ...state, audioFile: action.payload as File };
		case actions.SET_WAVEFORM:
			return { ...state, waveform: action.payload as Float32Array };
		case actions.SET_CURRENT_PCM:
			return { ...state, currentPCM: action.payload as number };
		case actions.SET_RESIZE_POSITION: {
			const LOWER_THRESHOLD = 100;
			const UPPER_THRESHOLD = state.windowHeight - 100;
			const position: number = action.payload as number;
			let dragging: boolean = true;
			if (!(LOWER_THRESHOLD < position && position < UPPER_THRESHOLD)) {
				dragging = false;
			}
			let res: number = position < LOWER_THRESHOLD ? LOWER_THRESHOLD : position;
			res = position > UPPER_THRESHOLD ? UPPER_THRESHOLD : res;
			return { ...state, resizePosition: res, isDragging: dragging };
		}
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
			seconds = seconds < 0 || Number.isNaN(seconds) ? 0 : seconds;
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
		case actions.SET_WAVELENGTH_LENGTH:
			return { ...state, wavelengthLength: action.payload as number };
		case actions.SET_AUDIO_DURATION:
			return { ...state, audioDuration: action.payload as number };
		case actions.SET_IS_DRAGGING:
			return { ...state, isDragging: action.payload as boolean };
		case actions.SET_WAVEFORM_SCROLL_POSITION:
			return { ...state, waveformScrollPosition: action.payload as number };
		case actions.SET_SEEK_HANDLE_MOUSE_DOWN:
			return { ...state, seekHandleMouseDown: action.payload as boolean };
		case actions.SET_GLOBAL_MOUSE_UP:
			return {
				...state,
				seekHandleMouseDown: false,
				isDraggingSelectionHandleRight: false,
				isDraggingSelectionHandleLeft: false,
			};
		case actions.SET_SELECTION_START_SECONDS: {
			const res: number = (action.payload as number) < 0 ? 0 : (action.payload as number);
			return { ...state, selectionStartSeconds: res };
		}
		case actions.SET_SELECTION_END_SECONDS: {
			let res: number = action.payload as number;
			if (res > state.audioDuration) {
				res = state.audioDuration;
			}
			return { ...state, selectionEndSeconds: res };
		}
		case actions.SET_ZOOM_FACTOR:
			return { ...state, zoomFactor: action.payload as number };
		case actions.SET_IS_DRAGGING_SELECTION_HANDLE_RIGHT:
			return { ...state, isDraggingSelectionHandleRight: action.payload as boolean };
		case actions.SET_IS_DRAGGING_SELECTION_HANDLE_LEFT:
			return { ...state, isDraggingSelectionHandleLeft: action.payload as boolean };
		case actions.SET_MIDI_DATA:
			return { ...state, midiData: action.payload as Midi };
		case actions.SET_WAVEFORM_CONTAINER_WIDTH:
			return { ...state, waveformContainerWidth: action.payload as number };
		case actions.SET_AUDIO_VOLUME:
			return { ...state, audioVolume: action.payload as number };
		case actions.SET_CHORD_VOLUME:
			return { ...state, chordVolume: action.payload as number };
		case actions.SET_SEEK_HANDLE_CONTAINER_REF:
			return {
				...state,
				seekHandleContainerRef: action.payload as MutableRefObject<HTMLDivElement | null>,
			};
		case actions.SET_CHORDS:
			return { ...state, chords: action.payload as Chord[] };
		case actions.SET_MIDI_FILE:
			return { ...state, midiFile: action.payload as ReadableStream<Uint8Array> };
		case actions.SET_LOADING_STATE:
			return { ...state, loadingState: action.payload as string };
		case actions.SET_ERROR_STATE:
			return { ...state, errorState: action.payload as string };
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
