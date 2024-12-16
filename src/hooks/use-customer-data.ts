import { useEffect, useState } from "react";
import data from "../lib/data.json";
import { z } from "zod";

const CustomerSchema = z.object({
  name: z.string(),
  id: z.string(),
  number_of_trades: z.number(),
  days_traded: z.number(),
  status: z.enum(["inactive", "ongoing", "passed", "closed"]),
  balance: z.number(),
  avg_win: z.number(),
  avg_loss: z.number(),
  win_ratio: z.number(),
  index: z.number(),
});

export type Customer = z.infer<typeof CustomerSchema>;

const getCustomerData = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    // faking a network request as part of the code test
    setTimeout(() => {
      const customers = CustomerSchema.array().parse(
        data.map((row, i) => ({ ...row, index: i + 1 }))
      );
      resolve(customers);
    }, 2000);
  });
};

export const useCustomerData = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const result = await getCustomerData();
      if (isMounted) {
        setCustomers(result);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data: customers ?? [],
    loading,
  };
};
