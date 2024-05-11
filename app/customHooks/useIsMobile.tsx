import { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
const useIsMobile = () => {
	const { state } = useAppState();
	const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

	useEffect(() => {
		setIsMobileDevice(
			/Android|webOS|iPhone|Surface|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Windows Tablet|Opera Mini/i.test(
				navigator.userAgent
			) ||
				(navigator.userAgent.includes('Macintosh') && 'ontouchend' in document) ||
				(navigator.userAgent.includes('Windows') && navigator.userAgent.includes('Touch'))
		);
	}, [state.windowWidth]);

	return isMobileDevice;
};

export default useIsMobile;
