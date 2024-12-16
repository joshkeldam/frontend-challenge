import type { Customer } from "../hooks/use-customer-data";
import { twJoin } from "tailwind-merge";
import { RxPlus, RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { convertToCurrency } from "../utils/formatting";
import { StatusPill } from "./status-pill";
import { BiSearch } from "react-icons/bi";
import { Pagination } from "./table-pagination";
import { useCustomerTableLogic } from "../hooks/use-customer-table-logic";
import { sample } from "lodash";

interface TableProps {
  data: Customer[];
  isLoading: boolean;
  pagination: boolean;
}

const formatHeader = (header: string) => {
  return header.replace(/_/g, " ").toUpperCase();
};

export const CustomerTable = ({ data, isLoading, pagination }: TableProps) => {
  const { state, dispatch, customerData, totalItems } =
    useCustomerTableLogic(data);
  const { currentPage, itemsPerPage, sortKey, sortDirection, searchQuery } =
    state;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const tableHeaders = (Object.keys(data[0]) as (keyof Customer)[]).filter(
    (header) => header !== "id" && header !== "index"
  );

  const handleSort = (header: keyof Customer) => {
    dispatch({ type: "SET_SORT", payload: { key: header } });
  };

  const handleAddAccount = () => {
    const name = window.prompt("Enter the new account name:");
    if (!name) return;

    const newCustomer: Customer = {
      index: Math.floor(Math.random() * (999 - 501 + 1)) + 501,
      id: Math.random().toString(36).substring(2, 9),
      name,
      number_of_trades: Math.floor(Math.random() * 100),
      days_traded: Math.floor(Math.random() * 30),
      status: sample([
        "inactive",
        "ongoing",
        "passed",
        "closed",
      ]) as Customer["status"],
      balance: parseFloat((Math.random() * 100000).toFixed(2)),
      avg_win: parseFloat((Math.random() * 2000 - 1000).toFixed(2)),
      avg_loss: parseFloat((Math.random() * 2000 - 1000).toFixed(2)),
      win_ratio: parseFloat((Math.random() * 100).toFixed(2)),
    };

    dispatch({ type: "ADD_ACCOUNT", payload: newCustomer });
  };

  return (
    <div className="bg-[#F4F7FC]">
      <div className="px-[10px] py-4 flex align-middle justify-between">
        <div className="grid grid-cols-1">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-300 sm:pl-9 sm:text-sm/6"
          />
          <BiSearch
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
          />
        </div>
        <button
          className="bg-[#2264E5] text-white text-sm font-medium flex items-center px-3 rounded-md"
          onClick={handleAddAccount}
        >
          <RxPlus className="text-lg mr-2" />
          <span>Add Account</span>
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead className="border-b border-[#E9EDF5]">
          <tr>
            {["index", ...tableHeaders].map((header) => {
              const isIndex = header === "index";
              const isActiveColumn = sortKey === header;
              const upArrowClass =
                isActiveColumn && sortDirection === "asc"
                  ? "text-black"
                  : "text-[#BCC2CE]";
              const downArrowClass =
                isActiveColumn && sortDirection === "desc"
                  ? "text-black"
                  : "text-[#BCC2CE]";

              return (
                <td key={String(header)} className="px-6 pt-1 pb-2">
                  <button
                    className="text-xs leading-4 font-semibold text-[#464F60] flex items-center"
                    onClick={() => handleSort(header as keyof Customer)}
                  >
                    <span>
                      {isIndex ? "#" : formatHeader(header as string)}
                    </span>
                    <span className="flex flex-col ml-1">
                      <RxTriangleUp
                        className={twJoin("-mb-1.5", upArrowClass)}
                      />
                      <RxTriangleDown className={downArrowClass} />
                    </span>
                  </button>
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {customerData.map((row) => (
            <tr key={row.index} className="odd:bg-white">
              <td className="px-6 py-3 whitespace-nowrap">
                <span className="text-sm leading-5 font-medium text=[#171C26]">
                  {row.index}
                </span>
              </td>
              <td className="px-6 py-3 whitespace-nowrap">
                <span className="flex flex-col">
                  <span className="text-sm font-medium leading-5 text-[#171C26]">
                    {row.name}
                  </span>
                  <span className="text-xs font-normal text-[#687182]">
                    {row.id}
                  </span>
                </span>
              </td>
              <td className="px-6 whitespace-nowrap">
                <span className="text-sm font-medium leading-5 text-[#464F60]">
                  {row.number_of_trades}
                </span>
              </td>
              <td className="px-6 whitespace-nowrap">
                <span className="text-sm font-medium leading-5 text-[#464F60]">
                  {row.days_traded}
                </span>
              </td>
              <td className="px-6 whitespace-nowrap">
                <StatusPill status={row.status} />
              </td>
              <td className="px-6 whitespace-nowrap">
                <span className="flex flex-col text-right">
                  <span className="text-sm font-medium leading-5 text-[#464F60]">
                    {convertToCurrency(row.balance)}
                  </span>
                  <span className="text-xs font-normal text-[#687182]">
                    USD
                  </span>
                </span>
              </td>
              <td className="px-6 whitespace-nowrap">
                <span className="flex flex-col text-right">
                  <span
                    className={twJoin(
                      "text-sm font-medium leading-5",
                      row.balance < 0 ? "text-[#D12953]" : "text-[#14804A]"
                    )}
                  >
                    {convertToCurrency(row.avg_win)}
                  </span>
                  <span className="text-xs font-normal text-[#687182]">
                    USD
                  </span>
                </span>
              </td>
              <td className="px-6 whitespace-nowrap">
                <span className="flex flex-col text-right">
                  <span className="text-sm font-medium leading-5 text-[#464F60]">
                    {convertToCurrency(row.avg_loss)}
                  </span>
                  <span className="text-xs font-normal text-[#687182]">
                    USD
                  </span>
                </span>
              </td>
              <td className="text-right px-6 whitespace-nowrap">
                <span className="text-sm font-medium leading-5 text-[#464F60]">
                  {`${row.win_ratio}%`}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={(p) => dispatch({ type: "SET_PAGE", payload: p })}
          setItemsPerPage={(p) =>
            dispatch({ type: "SET_ITEMS_PER_PAGE", payload: p })
          }
          items={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};
