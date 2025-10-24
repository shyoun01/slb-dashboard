export default function YearSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (y: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600"
      />
      <span className="text-xs">{max}</span>
    </div>
  );
}
