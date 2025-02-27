"use client";
import { createContext, useState, useEffect, useContext } from "react";
import {
  AppwriteDatabase,
  GDGCDatabase,
  ID,
  UserAccount,
} from "@/config/appwrite";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AddDataToCollection, GetSingleDocument } from "@/Services/Appwrite";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  // Modal State

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    isLogin: false,
    userData: {},
    isEventManager: false,
    isVendor: false,
  });
  const [userLoading, setuserLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setuserLoading(true);
      const accountDetails = await UserAccount.get();
      if (accountDetails) {
        return setUser({
          isLogin: true,
          userData: accountDetails,
          isEventManager: false,
          isVendor: false,
        });
      } else {
        return setUser({
          isLogin: false,
          userData: null,
          isEventManager: false,
          isVendor: false,
        });
      }
    } catch (error) {
      console.log(error);
      return setUser({
        isLogin: false,
        userData: null,
        isEventManager: false,
        isVendor: false,
      });
    } finally {
      setLoading(false);
      setuserLoading(false);
    }
  };

  // const updateUserDetails = async (userID, updatedData) => {
  //   try {
  //     const response = await AppwriteDatabase.updateDocument(
  //       GDGCDatabase,
  //       UsersCollection,
  //       userID,
  //       updatedData
  //     );
  //     setUser(response);
  //     toast.success("User details updated successfully!");
  //     return response;
  //   } catch (error) {
  //     return toast.error(error.message);
  //   }
  // };

  const logoutUser = async () => {
    try {
      await UserAccount.deleteSession("current");
      toast.success("Logged out successfully");
      checkUserStatus();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const contextData = {
    logoutUser,
    user,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* {loading ? <FullScreenSpinner />:children} */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
