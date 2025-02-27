"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OTPInput({ data, setData }) {
  return (
    <InputOTP
      value={data}
      onChange={(value) => setData(value)}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      className="flex gap-2"
    >
      <InputOTPGroup>
        {[...Array(6)].map((_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
