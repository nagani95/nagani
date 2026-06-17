//src/components/nagani-v2/NaganiTopLogo.tsx

type NaganiTopLogoProps = {
  subtitle?: string;
};

export default function NaganiTopLogo({ subtitle }: NaganiTopLogoProps) {
  return (
    <div className="text-center">
      <div className="text-3xl font-black tracking-[0.18em] text-[#ffd77a] drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]">
        NAGANI
      </div>
      {subtitle ? (
        <div className="mt-2 text-xs font-medium text-[#fff3d0]/80">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}