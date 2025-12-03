"use client";

import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
} from "@tanstack/react-query";
import React, { ReactNode } from "react";

const QueryClientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient();
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  );
};

export default QueryClientProvider;
