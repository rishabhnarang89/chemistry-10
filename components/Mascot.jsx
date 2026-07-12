export default function Mascot({
  size = 28,
  bg = "#A98BE3",
  mood = "neutral",
  eyeColor = "#453f52",
  className = "",
}) {
  const mouthPaths = {
    happy: "M11 19 Q15 22.5 19 19",
    neutral: "M11.5 19.5 Q15 20.5 18.5 19.5",
    excited: "M10.5 18.5 Q15 23.5 19.5 18.5",
  };
  const mouth = mouthPaths[mood] || mouthPaths.neutral;

  return (
    <svg
      viewBox="0 0 30 30"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <circle cx="15" cy="15" r="14" fill={bg} />
      <g className="origin-center animate-cq-blink" style={{ transformBox: "fill-box" }}>
        <circle cx="10.5" cy="14" r="1.7" fill={eyeColor} />
        <circle cx="19.5" cy="14" r="1.7" fill={eyeColor} />
      </g>
      <path d={mouth} stroke={eyeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
