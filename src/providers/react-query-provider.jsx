"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 3, // 3 menit stale time
            retry: (failureCount, error) => {
              // Jangan retry jika error client 4xx (400, 401, 403, 404, 422)
              const status = error?.response?.status;
              if (status && status >= 400 && status < 500) {
                return false;
              }
              // Hanya retry untuk network timeout / 5xx maksimal 2 kali
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}