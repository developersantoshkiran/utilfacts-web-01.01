"use client";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from '@mui/material/Button'
import Divider from "@mui/material/Divider";
import { useRouter } from "next/navigation";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import * as yup from "yup";
import { useFormik } from "formik";
import { POST } from "../utils/api";
import { signinResponse } from "../_types/types";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";
import { VerifyOTP } from "@/app/_components/verifyOTP";

export default function Page() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOTPPage, setShowOTPPage] = useState(false);
  const [otpReference, setotpReference] = useState('');
  const [otpresendTime, setOTPresetTime] = useState(0);
  const formref = useRef(undefined)
  const validationSchema = yup?.object({
    mobileNumber: yup
      .string()
      .required("Phone number is required")
      .test("mobileNumber", "Enter Valid Phone Number", (value) =>
        matchIsValidTel(`+91${value}`)
      ),
  });

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { reference,expiresInSeconds} = await POST<signinResponse>(
          "/login",
          values
        );
        if(reference && expiresInSeconds) {
          setShowOTPPage(true);
          setotpReference(reference);
          setOTPresetTime(expiresInSeconds)
        }
          
      } catch(e:any) {
        enqueueSnackbar(e.data.message || '', {variant: 'error', persist: true});
        setLoading(false)
      }
    },
  });

  function onResendOTPClick() {
    formik.handleSubmit(formref.current)
  }
  return (
    
      showOTPPage?<VerifyOTP otpReference={otpReference} onResendOTPClick={onResendOTPClick} otpresendTime={otpresendTime}></VerifyOTP>:<div className="login">
        <div className="hero">
          <div className="hero-title">
            <Image alt="logo" src="logo3.svg" width={300} height={40}></Image>
            <div className="hero-subtitle">
              Your One stop platform for all the Building management services.
            </div>
          </div>
        </div>
        <div className="main-content">
          <form className="login-form " ref={formref.current} onSubmit={formik.handleSubmit}>
            <div className="app_title" style={{ marginBottom: "12px" }}>
              Log In
            </div>
            <MuiTelInput
            disableFormatting
              name="mobileNumber"
              onlyCountries={["IN"]}
              id="mobileNumber"
              label="Mobile Number"
              value={formik.values.mobileNumber}
              onInput={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)
              }
              helperText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
              }
              disableDropdown
              forceCallingCode
              fullWidth
              defaultCountry="IN"
              sx={{ marginBottom: "12px" }}
            />
            <LoadingButton loading={loading} type="submit" fullWidth sx={{ marginBottom: "12px" }} variant="contained">
              Generate OTP
            </LoadingButton>

            <Divider
              flexItem
              textAlign="center"
              sx={{ marginBottom: "12px" }}
            />

            <div style={{ marginBottom: "12px" }}>
              <span>Dont have account?</span>
            </div>

            <Button
              onClick={() => push("/signup")}
              fullWidth
              variant="outlined"
            >
              Sign up
            </Button>
          </form>
        </div>
      </div>
  );
}
