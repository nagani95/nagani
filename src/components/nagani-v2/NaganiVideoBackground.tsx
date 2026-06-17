//src/components/nagani-v2/NaganiVideoBackground.tsx

type NaganiVideoBackgroundProps = {
  src?: string;
  poster?: string;
  fallbackClassName?: string;
};

export default function NaganiVideoBackground({
  src,
  poster,
  fallbackClassName = "bg-gradient-to-b from-[#090202] via-[#2a1209] to-[#090202]",
}: NaganiVideoBackgroundProps) {
  if (!src) {
    return <div className={`h-full w-full ${fallbackClassName}`} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#090202]">
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/70" />
    </div>
  );
}