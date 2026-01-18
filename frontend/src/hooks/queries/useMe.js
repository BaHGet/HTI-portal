import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../Api/Users/usersApi"; 
export const ME_QUERY_KEY = ["me"];

export function useMe(options = {}) {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    // getMe غالباً ثابتة بعد اللوجين
    staleTime: 1000 * 60 * 30, // 30 دقيقة
    gcTime: 1000 * 60 * 60, // ساعة
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
}
