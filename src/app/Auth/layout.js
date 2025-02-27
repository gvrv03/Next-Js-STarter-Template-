"use client";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

const AthLayout = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  if (user?.isLogin) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 h-[80vh]">
        <p className="font-semibold">Already Login</p>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="border border-blue-500  rounded-md px-5 py-2"
        >
          Go Home
        </button>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto w-full  ">
        <div>{children}</div>
      </div>
    );
  }
};

export default AthLayout;
