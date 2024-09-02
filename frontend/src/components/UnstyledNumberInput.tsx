const UnstyledNumberInput: React.FC<{
	value: string;
	onChange: (val: string) => void;
	className?: string;
	style?: React.CSSProperties;
}> = ({ value, onChange, className, style }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newValue = e.target.value;

		// Regular expression to allow only one leading sign (+ or -)
		newValue = newValue.replace(/[^-+\d]/g, "");

		// Ensure that only the first character can be a sign (+ or -)
		newValue = newValue.replace(/(?!^)[-+]/g, "");

		onChange(newValue);
	};

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			style={style}
			className={`outline-none p-0 m-0 ${className}`}
		/>
	);
};

export default UnstyledNumberInput; 