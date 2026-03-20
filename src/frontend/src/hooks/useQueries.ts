import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserLoyalty() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userLoyalty"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getUserLoyaltyData();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsersLoyalty() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsersLoyalty"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsersLoyaltyData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      await actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useAddStamp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("No actor");
      await actor.addStamp(user);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsersLoyalty"] });
    },
  });
}

export function useRedeemVoucher() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      voucherId,
    }: { user: Principal; voucherId: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.redeemVoucher(user, voucherId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsersLoyalty"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("No actor");
      await actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUsersLoyalty"] });
    },
  });
}

export function useRegisterGuestVisit() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).registerGuestVisit();
    },
  });
}

export function usePendingUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<Principal[]>({
    queryKey: ["pendingUsers"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getPendingUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).registerUser(user);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingUsers"] });
      qc.invalidateQueries({ queryKey: ["allUsersLoyalty"] });
    },
  });
}

export function useAllUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<[Principal, { name: string }][]>({
    queryKey: ["allUserProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUserWithName() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, name }: { user: Principal; name: string }) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).registerUserWithName(user, name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingUsers"] });
      qc.invalidateQueries({ queryKey: ["allUsersLoyalty"] });
      qc.invalidateQueries({ queryKey: ["allUserProfiles"] });
    },
  });
}

export function useSetUserProfileByAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      profile,
    }: { user: Principal; profile: { name: string } }) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).setUserProfileByAdmin(user, profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allUserProfiles"] });
    },
  });
}
