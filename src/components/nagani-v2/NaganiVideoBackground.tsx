//src/components/nagani-v2/NaganiVideoBackground.tsx

type NaganiVideoBackgroundProps = {
  videoSrc?: string;
  posterSrc?: string;
};

export default function NaganiVideoBackground({
  videoSrc = "/assets/nagani/v2/home-palace-loop.mp4",
  posterSrc = "/assets/nagani/v2/home-palace-poster.png",
}: NaganiVideoBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#090202]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}