type LightSwitchProps = {
  on: boolean;
  label: string;
  onToggle: () => void;
};

const screw =
  "absolute top-1/2 -mt-1 size-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#B7AF9E,#7E7666)] shadow-[inset_0_0_0_1px_#6E6757]";
const slot = "absolute inset-x-px top-[3.5px] h-px bg-[#4F4A3F]";

/** The old yellowed light switch: square plate, round rosette, two screws, a white rocker. */
export function LightSwitch({ on, label, onToggle }: LightSwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className="flex cursor-pointer flex-col items-center gap-3 p-2 font-label text-[0.8125rem] tracking-label text-cream uppercase"
    >
      <span
        aria-hidden="true"
        className="relative flex size-29.5 items-center justify-center rounded-[9px] bg-[#E4DCC8] shadow-[inset_0_0_0_1px_#CFC4AB,inset_0_0_22px_rgba(120,96,52,0.28),inset_0_2px_0_#F1EBDD,0_2px_0_#B9AE95,0_14px_28px_rgba(0,0,0,0.45)]"
      >
        {/* Age stains */}
        <span className="absolute top-2.25 right-2.75 h-4 w-6.5 rounded-[50%] bg-[rgba(110,90,55,0.16)] blur-[3px]" />
        <span className="absolute bottom-3 left-3.5 h-2.25 w-3.5 rounded-[50%] bg-[rgba(90,74,44,0.14)] blur-[2px]" />
        {/* Rosette */}
        <span className="relative flex size-18.5 items-center justify-center rounded-full bg-[#E8E1CF] shadow-[0_0_0_2px_#D3C9B1,inset_0_2px_1px_#F6F1E6,inset_0_-3px_2px_#C8BDA3,0_2px_3px_rgba(80,64,36,0.25)]">
          <span className={`${screw} left-2.25`}>
            <span className={`${slot} -rotate-30`} />
          </span>
          <span className={`${screw} right-2.25`}>
            <span className={`${slot} rotate-20`} />
          </span>
          <span className="flex h-11.5 w-6.5 items-center justify-center rounded-sm bg-[#5F584B] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
            <span
              className={`h-10 w-5 rounded-[3px] ${
                on
                  ? "bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F0EA_42%,#C9C3B7_58%,#DAD5CB_100%)] shadow-[0_-1px_0_#FFFFFF,0_3px_3px_rgba(0,0,0,0.35)]"
                  : "bg-[linear-gradient(180deg,#DAD5CB_0%,#C9C3B7_42%,#F3F0EA_58%,#FFFFFF_100%)] shadow-[0_1px_0_#FFFFFF,0_-3px_3px_rgba(0,0,0,0.35)]"
              }`}
            />
          </span>
        </span>
      </span>
      <span>{label}</span>
    </button>
  );
}
