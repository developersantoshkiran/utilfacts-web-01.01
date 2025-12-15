import { Button } from "@mui/material";
import { useState, useCallback, useEffect } from "react";

export function ResendOTP({ otpresendTime, onClick }: any) {
    const [timer, setTimer] = useState(otpresendTime);
    const timeOutCallback = useCallback(() => setTimer((currTimer: any) => currTimer - 1), []);

    useEffect(() => {
        timer > 0 && setTimeout(timeOutCallback, 1000);
    }, [timer, timeOutCallback]);

    return <Button onClick={() => { setTimer(otpresendTime * 2); onClick() }} disabled={timer !== 0} fullWidth variant="outlined">
        Resend OTP {timer > 0 ? `(${timer})` : ''}
    </Button>
}