interface OTPTemplateProps {
  otp: number;
}

export const OTPTemplate: React.FC<Readonly<OTPTemplateProps>> = ({
  otp,
}) => (
  <div> 
    <p>Your OTP is for utilfacts is: <strong><em>{otp}</em></strong></p>
  </div>
);