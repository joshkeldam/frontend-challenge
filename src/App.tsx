import { CustomerTable } from "./components/customer-table";
import { useCustomerData } from "./hooks/use-customer-data";

export function App() {
  const { data, loading } = useCustomerData();

  return (
    <div className="bg-[#F7F9FC] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
          <CustomerTable data={data} isLoading={loading} pagination />
        </div>
      </div>
    </div>
  );
}
