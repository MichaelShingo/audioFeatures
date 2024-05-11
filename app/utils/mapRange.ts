export function mapRange(
	value: number,
	fromMin: number,
	fromMax: number,
	toMin: number,
	toMax: number
): number {
	const clampedValue = Math.min(Math.max(value, fromMin), fromMax);
	const mappedValue =
		((clampedValue - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;

	return mappedValue;
}
