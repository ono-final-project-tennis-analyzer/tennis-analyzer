import { useMeQuery } from "@/services/accounts.service.ts";
import React, { useEffect } from "react";

export const PrivateRoute: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (isError) {
      window.location.href = "/login";
    }
  }, [isError]);

  if (isLoading) return <div>Loading...</div>;
  return !isError ? children : null;
};
