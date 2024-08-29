// biome-ignore lint/suspicious/noExplicitAny: should work with any function
const debounce = <T extends (...args: any[]) => any>(
	func: T,
	delay: number,
): T => {
	let timeoutId: ReturnType<typeof setTimeout>;
	// biome-ignore lint/suspicious/noExplicitAny: should work with any function
	return function (this: any, ...args: Parameters<T>) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	} as T;
};
export default debounce;
