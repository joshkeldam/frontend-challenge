import { useReducer, useMemo, useEffect } from "react";
import { orderBy } from "lodash";
import Fuse from "fuse.js";
import type { Customer } from "../hooks/use-customer-data";

type TableState = {
  currentPage: number;
  itemsPerPage: number;
  sortKey: keyof Customer | null;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  data: Customer[];
};

type Action =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_ITEMS_PER_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: { key: keyof Customer } }
  | { type: "ADD_ACCOUNT"; payload: Customer }
  | { type: "INIT"; payload: Customer[] };

const tableReducer = (state: TableState, action: Action): TableState => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEMS_PER_PAGE":
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case "SET_SORT":
      if (state.sortKey === action.payload.key) {
        return {
          ...state,
          sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
          currentPage: 1,
        };
      } else {
        return {
          ...state,
          sortKey: action.payload.key,
          sortDirection: "asc",
          currentPage: 1,
        };
      }
    case "ADD_ACCOUNT":
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case "INIT":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

const initialState: TableState = {
  currentPage: 1,
  itemsPerPage: 10,
  sortKey: "index",
  sortDirection: "asc",
  searchQuery: "",
  data: [],
};

export const useCustomerTableLogic = (data: Customer[]) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);
  const { currentPage, itemsPerPage, sortKey, sortDirection, searchQuery } =
    state;

  let filteredData: Customer[];

  useEffect(() => {
    dispatch({ type: "INIT", payload: data || [] });
  }, [data]);

  if (state.data.length === 0) {
    filteredData = data;
  } else {
    const fuse = new Fuse(state.data, { keys: ["name", "id"], threshold: 0.3 });
    filteredData =
      searchQuery.trim() === ""
        ? state.data
        : fuse.search(searchQuery).map((result) => result.item);
  }

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return orderBy(filteredData, [sortKey], [sortDirection]);
  }, [filteredData, sortKey, sortDirection]);

  const startPage = (currentPage - 1) * itemsPerPage;
  const customerData = sortedData.slice(startPage, startPage + itemsPerPage);

  return {
    state,
    dispatch,
    customerData,
    totalItems: sortedData.length,
  };
};
