import { twJoin } from "tailwind-merge";
import { capitaliseFirstLetter } from "../utils/formatting";

interface Status {
  status: "inactive" | "ongoing" | "passed" | "closed";
}

const statusColours = {
  inactive: "bg-[#E9EDF5] text-[#5A6376]",
  ongoing: "bg-[#F0F1FA] text-[#4F5AED]",
  passed: "bg-[#E1FCEF] text-[#14804A]",
  closed: "bg-[#FAF0F3] text-[#D12953]",
};

export function StatusPill({ status }: Status) {
  return (
    <span
      className={twJoin(
        "block text-xs font-medium leading-5 py-1 px-2 text-center rounded-xl",
        statusColours[status]
      )}
    >
      {capitaliseFirstLetter(status)}
    </span>
  );
}
