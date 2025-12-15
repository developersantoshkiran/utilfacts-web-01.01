'use client'
import Image from "next/image";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import LoadingButton from "@mui/lab/LoadingButton";
import { POST } from "../utils/api";
import { OTPResponse } from "../_types/types";
import { enqueueSnackbar } from "notistack";
import { ResendOTP } from "./resendbutton";


const validationSchema = yup?.object({
  otp: yup
    .string()
    .required("OTP is Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Must be 4 digits")
    .max(4, "Must be 4 digits")
    .required("OTP is required"),
});

export function VerifyOTP({otpresendTime, otpReference, onResendOTPClick}: {otpresendTime:number, otpReference:string, onResendOTPClick:() => void}) {
  const { push } = useRouter();  
  const [loading, setLoading] = useState(false);
  type verifyOTP = yup.InferType<typeof validationSchema>;
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: verifyOTP) => {
      try {
        setLoading(true);
        const response = await POST<OTPResponse>("/verifyOTP", {otp: values.otp, reference:otpReference});
        push("/");
      } catch (e: any) {
        enqueueSnackbar(e.message || "", { variant: "error", persist: true });
        setLoading(false)
      }
    },
  });


  return (
    <>
      <div className="login">
        <div className="hero">
          <div className="hero-title">
            <Image alt="logo" src="logo3.svg" width={300} height={40}></Image>
            <div className="hero-subtitle">
              Your One stop platform for all the Building management services.
            </div>
          </div>
        </div>
        <div className="main-content">
          <form onSubmit={formik.handleSubmit} className="login-form ">
            <div className="app_title" style={{ marginBottom: "12px" }}>
              OTP
            </div>
            <MuiOtpInput
              //@ts-ignore
              name="otp"
              id="otp"
              label="otp"
              length={4}
              autoFocus
              value={formik.values.otp}
              onChange={(value: string) =>
                formik.handleChange({ target: { value, id: "otp" } })
              }
              onBlur={formik.handleBlur}
            />
            <FormHelperText
              style={{ marginBottom: "12px" }}
              error={Boolean(formik.errors.otp)}
            >
              {formik.errors.otp}
            </FormHelperText>
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              sx={{ marginBottom: "12px" }}
              variant="contained"
            >
              Verify OTP
            </LoadingButton>

            <Divider
              flexItem
              textAlign="center"
              sx={{ marginBottom: "12px" }}
            />

            <div style={{ marginBottom: "12px" }}>
              <span>Didnt receive OTP?</span>
            </div>

            <ResendOTP onClick={onResendOTPClick} otpresendTime={otpresendTime}></ResendOTP>
          </form>
        </div>
      </div>

    </>
  );
}
