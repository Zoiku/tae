import "../Styles/ForgotPassword.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from "../Material/Button";
import { NavLink } from "react-router-dom";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

const ForgotPassword = () => {
    const navLinkStyle = {
        fontWeight: 500,
        color: "var(--tae-orange)",
        textDecoration: "none",
    }

    return (
        <div className="Forgot-Password">
            <div className="forgot-password-form-container">
                <div className="left-container">
                    <NavLink className="go-back-container" style={navLinkStyle} to="/login">
                        <div><ArrowBackIosRoundedIcon sx={{ fontSize: 18 }} /></div>
                        <div>Back to Login</div>
                    </NavLink>
                    <div className="forgot-password-form-desc">
                        <div>Reset Password ?</div>
                        <div>Kindly enter your email address to reset password</div>
                    </div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { width: '100%', margin: "10px 0" },
                        }}
                        autoComplete="off"
                    >
                        <TextField type="text" name="username" label="Email" variant="outlined" />
                        <PrimaryButton variant="contained" type="submit">Send Reset Link</PrimaryButton>
                    </Box>
                </div>
                <div className="right-container"></div>
            </div>
        </div>
    )
}

export default ForgotPassword;