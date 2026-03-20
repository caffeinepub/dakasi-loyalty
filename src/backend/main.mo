import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Int "mo:core/Int";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Voucher {
    public func compare(v1 : Voucher, v2 : Voucher) : Order.Order {
      Text.compare(v1.id, v2.id);
    };
  };

  module UserLoyaltyData {
    public func compareByStampCount(a : UserLoyaltyData, b : UserLoyaltyData) : Order.Order {
      Int.compare(a.stampCount, b.stampCount);
    };
  };

  type StampEntry = {
    timestamp : Time.Time;
    source : Text;
  };

  type Voucher = {
    id : Text;
    created : Time.Time;
    redeemed : Bool;
  };

  type UserLoyaltyData = {
    stampCount : Int;
    vouchers : List.List<Voucher>;
    stampHistory : List.List<StampEntry>;
  };

  type LoyaltyResponse = {
    stampCount : Int;
    vouchers : [Voucher];
    stampHistory : [StampEntry];
  };

  public type UserProfile = {
    name : Text;
  };

  let users = Map.empty<Principal, UserLoyaltyData>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let pendingUsers = Map.empty<Principal, Time.Time>();
  var voucherCounter = 1000;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Called by guests when they first sign in, to appear in admin's pending list
  public shared ({ caller }) func registerGuestVisit() : async () {
    // Check the role map directly to avoid trapping on unregistered users
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { return };
      case (?#user) { return };
      case (_) {
        pendingUsers.add(caller, Time.now());
      };
    };
  };

  // Admin: get all guests waiting to be registered
  public query ({ caller }) func getPendingUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending users");
    };
    pendingUsers.toArray().map(func((p, _)) { p });
  };

  // Admin: register a guest as a user (removes from pending)
  public shared ({ caller }) func registerUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can register users");
    };
    AccessControl.assignRole(accessControlState, caller, user, #user);
    pendingUsers.remove(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserLoyaltyData() : async LoyaltyResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loyalty data");
    };
    let userData = switch (users.get(caller)) {
      case (?data) { data };
      case (null) { emptyUserLoyaltyData() };
    };
    {
      stampCount = userData.stampCount;
      vouchers = userData.vouchers.toArray().sort();
      stampHistory = userData.stampHistory.toArray();
    };
  };

  public shared ({ caller }) func addStamp(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add stamps");
    };
    let userData = switch (users.get(user)) {
      case (?data) { data };
      case (null) { emptyUserLoyaltyData() };
    };
    let newStampHistory = userData.stampHistory.clone();
    newStampHistory.add({ timestamp = Time.now(); source = "purchase" });
    let newStampCount = if (userData.stampCount + 1 >= 12) { 0 } else {
      userData.stampCount + 1;
    };
    let newVouchers = userData.vouchers.clone();
    if (userData.stampCount + 1 >= 12) {
      newVouchers.add(createVoucher());
      newStampHistory.add({ timestamp = Time.now(); source = "reward" });
    };
    let updatedUserData : UserLoyaltyData = {
      userData with
      stampCount = newStampCount;
      vouchers = newVouchers;
      stampHistory = newStampHistory;
    };
    users.add(user, updatedUserData);
  };

  public shared ({ caller }) func redeemVoucher(user : Principal, voucherId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can redeem vouchers");
    };
    switch (users.get(user)) {
      case (?userData) {
        let vouchersArray = userData.vouchers.toArray();
        let voucherIndex = vouchersArray.findIndex(func(v) { v.id == voucherId });
        switch (voucherIndex) {
          case (?index) {
            let targetVoucher = vouchersArray[index];
            if (targetVoucher.redeemed) { Runtime.trap("Voucher already redeemed") };
            let newStampHistory = userData.stampHistory.clone();
            newStampHistory.add({ timestamp = Time.now(); source = "redeem" });
            let newVouchers = userData.vouchers.clone();
            newVouchers.clear();
            for (voucher in vouchersArray.values()) {
              if (voucher.id == voucherId) {
                newVouchers.add({ voucher with redeemed = true });
              } else {
                newVouchers.add(voucher);
              };
            };
            let updatedUserData : UserLoyaltyData = {
              userData with
              vouchers = newVouchers;
              stampHistory = newStampHistory;
            };
            users.add(user, updatedUserData);
            return ();
          };
          case (null) { Runtime.trap("Voucher not found") };
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public query ({ caller }) func getAllUsersLoyaltyData() : async [(Principal, LoyaltyResponse)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all data");
    };
    let userArray = users.toArray().sort(func((_, a), (_, b)) { UserLoyaltyData.compareByStampCount(a, b) });
    userArray.map(func((principal, data)) {(principal, loyaltyDataToResponse(data))});
  };

  func loyaltyDataToResponse(data : UserLoyaltyData) : LoyaltyResponse {
    {
      stampCount = data.stampCount;
      vouchers = data.vouchers.toArray();
      stampHistory = data.stampHistory.toArray();
    };
  };

  func createVoucher() : Voucher {
    let voucher : Voucher = {
      id = voucherCounter.toText();
      created = Time.now();
      redeemed = false;
    };
    voucherCounter += 1;
    voucher;
  };

  func emptyUserLoyaltyData() : UserLoyaltyData {
    {
      stampCount = 0;
      vouchers = List.empty<Voucher>();
      stampHistory = List.empty<StampEntry>();
    };
  };
};
