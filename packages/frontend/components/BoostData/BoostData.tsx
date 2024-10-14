import Link from "next/link";

import Palm from "../svg/Palm";

/**
 * BoostData component for the home page
 */
const BoostData: React.FC<Record<string, unknown>> = (
  props: Record<string, unknown>,
) => {
  return (
    <Link href="/boosts" {...props}>
      <div className="flex flex-col gap-half-inner">
        <Palm className="w-auto h-[48px]" />
        <span className="text-center text-white">Boosts</span>
      </div>
    </Link>
  );
};

export { BoostData };
