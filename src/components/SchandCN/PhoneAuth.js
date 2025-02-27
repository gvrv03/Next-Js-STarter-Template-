"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendOTP, verifyOTP } from "@/Services/Appwrite";
import toast from "react-hot-toast";
import { useAuth } from "@/Context/AuthContext";
import { OTPInput } from "./OTPInput";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [curUser, setCurUser] = useState(null);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const { checkUserStatus } = useAuth();

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendOTP(phone);
      setOtpSent(true);
      setCurUser(res);
      setTimer(59);
      setCanResend(false);
      toast.success("OTP Sent Successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(curUser, otp);
      toast.success("OTP Verified Successfully!");
      checkUserStatus();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" border p-2 md:max-w-96 flex flex-col items-center justify-center rounded-lg w-full">
      <form className="w-full">
        <div className="flex gap-2 flex-col items-center justify-center">
          {!otpSent ? (
            <>
              <div className=" w-full">
                <h3 className="text-left font-semibold text-xl ">
                  Continue with phone
                </h3>
              </div>
              <Input
                type="number"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="p-3 border outline-none rounded-lg"
              />
              <Button
                onClick={handleSendOtp}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <h3 className="text-center font-semibold text-xl pb-2">
                  Enter Verification Code
                </h3>
                <h5 className="text-center text-sm py-1">
                  We've sent a verification code to{" "}
                  <span className="font-semibold text-blue-500">{phone}</span>
                </h5>
              </div>
              <OTPInput data={otp} setData={setOtp} />
              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <div className="text-center ">
                {canResend ? (
                  <Button
                    variant="link"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Resend OTP in {timer}s
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default PhoneAuth;
