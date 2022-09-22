import "../Styles/ForgotPassword.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from "../Material/Button";
import { NavLink, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AuthService from "../Services/Auth";
import { useEffect, useReducer, useState } from "react";
import { INITIAL_STATE, formReducer } from "../Reducers/FormReducer";
import { INPUTING, REQUEST_FAILED, REQUEST_SUCCESSFUL, SEND_REQUEST } from "../Reducers/Actions";
import { useDispatch } from "react-redux";
import { setAlert } from "../Redux/Features/Alert.js";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ForgotPassword = () => {
    const navLinkStyle = {
        fontWeight: 500,
        color: "var(--tae-orange)",
        textDecoration: "none",
    }
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };
    const [resetView, setResetView] = useState(false);
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
    const rootDispatch = useDispatch();
    const { token } = useParams();

    const handleChange = (e) => { dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value }); }

    const handleSuccessfullRequest = (message, timeOut) => {
        const payload = {
            severity: "success",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    }

    const handleFailedRequest = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    }

    const handleSendPasswordLink = async (e) => {
        e.preventDefault();
        dispatch({ type: SEND_REQUEST });
        const authService = new AuthService();
        try {
            const { errors } = await authService.sendResetPasswordLink(state.payload.email);
            if (errors.length === 0) {
                dispatch({ type: REQUEST_SUCCESSFUL });
                handleSuccessfullRequest("Password link sent to your email", 4000);
                e.target.reset();
            } else {
                dispatch({ type: REQUEST_FAILED });
                handleFailedRequest("Please enter a valid email link", 6000);
            }
        } catch (error) { }
    }

    useEffect(() => {
        if (token) {
            setResetView(true);
        }
    }, [token]);

    return (
        <div className="Forgot-Password">
            <div className="forgot-password-form-container">
                <div className="left-container">
                    <NavLink className="go-back-container" style={navLinkStyle} to="/login">
                        <div><ArrowBackIcon sx={{ fontSize: 18 }} /></div>
                        <div>Back to Login</div>
                    </NavLink>
                    <div className="forgot-password-form-desc">
                        <div>Reset Password ?</div>
                        <div>Kindly enter your email address to reset password</div>
                    </div>

                    {
                        !resetView ?
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { width: '100%', margin: "10px 0" },
                                }}
                                autoComplete="off"
                                onSubmit={handleSendPasswordLink}
                            >
                                <TextField error={state.requestState.error != null} onChange={handleChange} type="email" name="email" label="Email" variant="outlined" />
                                <PrimaryButton loading={state.requestState.loading} variant="contained" type="submit">Send Reset Link</PrimaryButton>
                            </Box>
                            :
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { width: '100%', margin: "10px 0" },
                                }}
                                autoComplete="off"
                                onSubmit={handleSendPasswordLink}
                            >
                                <TextField
                                    required
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggleShowPassword}
                                                onMouseDown={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                    helperText="Your password must be at least 8 characters long" fullWidth onChange={handleChange} type={showPassword ? "text" : "password"} name="password" label="Password" variant="outlined" />
                                <PrimaryButton loading={state.requestState.loading} variant="contained" type="submit">Update Password</PrimaryButton>
                            </Box>
                    }


                </div>
                <div className="right-container"></div>
            </div>
        </div>
    )
}

export default ForgotPassword;