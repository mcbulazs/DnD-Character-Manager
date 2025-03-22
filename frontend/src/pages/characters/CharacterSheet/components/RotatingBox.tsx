const RotationCircle: React.FC<{
  profRotation: number;
  setProfRotation: (val: number) => void;
  max: number;
  disabled?: boolean;
}> = ({ profRotation, setProfRotation, max, disabled = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.button !== 0 || disabled) {
      return;
    }
    setProfRotation((profRotation + 1) % max);
  };
  const colors = ["transparent", "blue", "red", "green", "yellow"];

  return (
    <div
      className={`rounded-full w-4 aspect-square ${disabled ? "" : "cursor-pointer"} border-2 border-black`}
      onMouseDown={handleClick}
      style={{
        backgroundColor: colors[profRotation],
        transition: "background-color 0.3s ease",
      }}
      title={`Current State: ${profRotation === 1 ? "Proficient" : profRotation === 2 ? "Expertise" : "Not Proficient"}`}
    />
  );
};

export default RotationCircle;
