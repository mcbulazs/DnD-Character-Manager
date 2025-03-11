import { useEffect, useState } from "react";

const UnstyledNumberInput: React.FC<{
  defaultValue: number;
  maxValue?: number;
  minValue?: number;
  onChange: (val: number) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}> = ({
  defaultValue,
  onChange,
  className,
  style,
  disabled,
  maxValue,
  minValue,
}) => {
    const [value, setValue] = useState<string>(defaultValue.toString());

    useEffect(() => {
      setValue(defaultValue.toString());
    }, [defaultValue]);

    const handleCalculation = (val: string) => {
      const newValue = val.replace(/[+-]$/g, "");
      console.log(newValue);
      const result: number = Number(new Function(`return ${newValue}`)());

      if (maxValue !== undefined && result > maxValue) {
        setValue(maxValue.toString());
        return onChange(maxValue);
      }
      if (minValue !== undefined && result < minValue) {
        setValue(minValue.toString());
        return onChange(minValue);
      }

      setValue(result.toString());
      onChange(result);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCalculation(value);
      }
    };

    const handleBlur = () => {
      handleCalculation(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newVal = e.target.value.replace(/[^0-9+\-]/g, "");
      newVal = newVal.replace(/([+-])[+-]*/g, "$1");
      setValue(newVal);
    };

    return (
      <input
        disabled={disabled}
        type="text"
        value={value}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        style={style}
        className={`outline-none p-0 m-0 ${className}`}
      />
    );
  };

export default UnstyledNumberInput;
