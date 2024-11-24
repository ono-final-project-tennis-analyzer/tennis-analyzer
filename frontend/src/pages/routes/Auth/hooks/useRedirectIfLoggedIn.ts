import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useMeQuery} from "@/services/accounts.service.ts";

export function useRedirectIfLoggedIn() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMeQuery();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return { isLoading };
}
