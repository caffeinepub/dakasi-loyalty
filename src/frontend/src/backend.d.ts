import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoyaltyResponse {
    vouchers: Array<Voucher>;
    stampHistory: Array<StampEntry>;
    stampCount: bigint;
}
export interface Voucher {
    id: string;
    created: Time;
    redeemed: boolean;
}
export type Time = bigint;
export interface StampEntry {
    source: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStamp(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllUsersLoyaltyData(): Promise<Array<[Principal, LoyaltyResponse]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingUsers(): Promise<Array<Principal>>;
    getUserLoyaltyData(): Promise<LoyaltyResponse>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    redeemVoucher(user: Principal, voucherId: string): Promise<void>;
    registerGuestVisit(): Promise<void>;
    registerUser(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
