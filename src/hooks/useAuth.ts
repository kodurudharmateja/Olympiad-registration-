import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type UserRole = "ADMIN" | "SCHOOL" | "PARENT" | null;

export interface UnifiedUser {
  id: number;
  name: string;
  email?: string | null;
  mobile?: string | null;
  role: UserRole;
}

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: adminData,
    isLoading: adminLoading,
  } = trpc.admin.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: schoolData,
    isLoading: schoolLoading,
  } = trpc.school.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: parentData,
    isLoading: parentLoading,
  } = trpc.parent.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutAdmin = trpc.admin.logout.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const logoutSchool = trpc.school.logout.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const logoutParent = trpc.parent.logout.useMutation({
    onSuccess: () => utils.invalidate(),
  });

  const user: UnifiedUser | null = useMemo(() => {
    if (adminData) {
      return {
        id: adminData.id,
        name: adminData.name ?? "Administrator",
        email: adminData.email,
        role: "ADMIN" as const,
      };
    }
    if (schoolData) {
      return {
        id: schoolData.id,
        name: schoolData.name,
        mobile: schoolData.mobile,
        role: "SCHOOL" as const,
      };
    }
    if (parentData) {
      return {
        id: parentData.id,
        name: parentData.name,
        mobile: parentData.mobile,
        role: "PARENT" as const,
      };
    }
    return null;
  }, [adminData, schoolData, parentData]);

  const isLoading = adminLoading || schoolLoading || parentLoading;
  const isAuthenticated = !!user;
  const role = user?.role ?? null;

  const logout = useCallback(() => {
    if (role === "ADMIN") logoutAdmin.mutate();
    else if (role === "SCHOOL") logoutSchool.mutate();
    else if (role === "PARENT") logoutParent.mutate();
    // Clear all auth state by reloading
    setTimeout(() => {
      window.location.href = "/";
    }, 200);
  }, [role, logoutAdmin, logoutSchool, logoutParent]);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      role,
      logout,
      isAdmin: role === "ADMIN",
      isSchool: role === "SCHOOL",
      isParent: role === "PARENT",
    }),
    [user, isAuthenticated, isLoading, role, logout]
  );
}
