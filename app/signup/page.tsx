'use client'
import Image from "next/image";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from '@mui/material/Divider';
import { useRouter } from "next/navigation";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import * as yup from 'yup'
import { useFormik } from "formik";
import { POST } from "../utils/api";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { signUpResponse } from "../_types/types";
import { VerifyOTP } from "../_components/verifyOTP";

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
  const {push} = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOTPPage, setShowOTPPage] = useState(false);
  const [otpReference, setotpReference] = useState('');
  const [otpresendTime, setOTPresetTime] = useState(0);
  const formref = useRef(undefined)
  const validationSchema = yup?.object({
    fullName: yup.string().required("Full fullName is Required"),
    emailId: yup
      .string()
      .email("Enter a valid emailId")
      .required("emailId is Required"),
    mobileNumber: yup
      .string()
      .required("Phone number is required")
      .test("phoneNumber", "Enter Valid Phone Number", (value) =>
        matchIsValidTel(`+91${value}`)
      ),
      "dob": yup.string().nullable(),
      description: yup.string().nullable()
  });

  type signUp = yup.InferType<typeof validationSchema>;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      "dob": null,
      "description": null,
      mobileNumber: "",
      emailId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: signUp) => {
      try {
        setLoading(true);
        const { id, expiresInSeconds } = await POST<signUpResponse>(
          "/signup",
          values
        );
        if(id && expiresInSeconds) {
          setShowOTPPage(true);
          setotpReference(id);
          setOTPresetTime(expiresInSeconds)
        }
      } catch(e:any) {
       
        enqueueSnackbar(e.message || '', {variant: 'error', persist: true})
     
      }
 
    },
  });

  function onResendOTPClick() {
    formik.handleSubmit(formref.current)
  }
  return (
    
      showOTPPage?<VerifyOTP otpReference={otpReference} onResendOTPClick={onResendOTPClick} otpresendTime={otpresendTime}></VerifyOTP>
      :<div className="signup">
        <div className="hero">
          <div className="hero-title">
            <Image alt="logo" src="logo3.svg" width={300} height={40}></Image>
            <div className="hero-subtitle">
              Your One stop platform for all the Building management services.
            </div>
          </div>
        </div>
        <div className="main-content">
          <form ref={formref.current} className="signup-form" onSubmit={formik.handleSubmit} >
            <div className="app_title" style={{ marginBottom: "12px" }}>
              Signup
            </div>
            <TextField
              fullWidth
              name="fullName"
              id="fullName"
              value={formik.values.fullName}
              onInput={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={<>{formik.touched.fullName && formik.errors.fullName}</>}
              sx={{ marginBottom: "12px" }}
              margin="dense"
              label="Enter Your Full Name"
              variant="outlined"
            />
            <TextField
              name="emailId"
              id="emailId"
              type="emailId"
              fullWidth
              value={formik.values.emailId}
              onInput={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.emailId && Boolean(formik.errors.emailId)}
              helperText={<>{formik.touched.emailId && formik.errors.emailId}</>}
              sx={{ marginBottom: "12px" }}
              margin="dense"
              label="Enter Your Email ID"
              variant="outlined"
            />
            <MuiTelInput
              disableFormatting
              name="mobileNumber"
              onlyCountries={["IN"]}
              id="mobileNumber"
              label="Mobile Number"
              value={formik.values.mobileNumber}
              onInput={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={<>{formik.touched.mobileNumber && formik.errors.mobileNumber}</>}
              disableDropdown
              forceCallingCode
              fullWidth
              defaultCountry="IN"
              sx={{ marginBottom: "12px" }}
            />
            <LoadingButton
              type='submit'
              fullWidth
              sx={{ marginBottom: "12px" }}
              loading = {loading}
              variant="contained"
            >
              Generate OTP
            </LoadingButton>

            <Divider
              flexItem
              textAlign="center"
              sx={{ marginBottom: "12px" }}
            />

            <div style={{ marginBottom: "12px" }}>
              <span>Already have an account?</span>
            </div>

            <Button onClick={() => push('/login')} fullWidth variant="outlined">
              Log In
            </Button>
          </form>
        </div>
      </div>
  );
}
