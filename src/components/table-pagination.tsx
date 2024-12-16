import { useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  items: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

const VISIBLE_OPTIONS = [10, 20, 50, 100];

export const Pagination = ({
  currentPage,
  items,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(items / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [items, itemsPerPage, currentPage, setCurrentPage, totalPages]);

  const handleButtonClick = (type: "next" | "prev") => {
    if (type === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (type === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startPage = (currentPage - 1) * itemsPerPage;
  const endPage = startPage + itemsPerPage;

  return (
    <div className="flex flex-row justify-between items-center py-3 px-5 border-t border-[#E9EDF5]">
      <div className="text-[12px] text-[#687182]">
        <span>
          {startPage + 1}-{Math.min(endPage, items)}
        </span>{" "}
        <span>of</span> <span>{items}</span>
      </div>
      <div className="text-[12px] text-[#687182] flex items-center">
        <div>
          <span>Rows per page:</span>
          <select
            className="bg-none mx-1"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {VISIBLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-4 flex items-center">
          <button
            disabled={currentPage === 1}
            className="border bg-white w-6 h-5 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleButtonClick("prev")}
          >
            <IoChevronBack />
          </button>{" "}
          <span className="w-14 text-center">
            {currentPage}/{totalPages}
          </span>{" "}
          <button
            disabled={currentPage === totalPages}
            className="border bg-white w-6 h-5 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleButtonClick("next")}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>
    </div>
  );
};
