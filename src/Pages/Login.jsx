import "../Styles/Login.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from "../Material/Button";
import { useEffect, useReducer } from "react";
import { INITIAL_STATE, formReducer } from "../Reducers/FormReducer";
import { INPUTING, SEND_REQUEST, REQUEST_SUCCESSFUL, REQUEST_FAILED } from "../Reducers/Actions";
import AuthService from "../Services/Auth";
import { useDispatch, useSelector } from "react-redux";
import { startSession } from "../Redux/Features/Session.js";
import { setAlert, clearAlerts } from "../Redux/Features/Alert.js"
import { useNavigate } from "react-router-dom";

const ROLES = {
    ADMIN: "/admin/dashboard",
    MERCHANT: "/merchant/dashboard",
    BUYER: "/buyer/dashboard",
}

const Login = () => {
    const navigate = useNavigate();
    const rootDispatch = useDispatch();
    const { session } = useSelector(state => state);
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);

    const handleChange = (e) => { dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value }); }

    const handleFailedRequest = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: SEND_REQUEST });
        const authService = new AuthService();
        try {
            const { data, errors } = await authService.signIn(state.payload);
            if (errors.length === 0) {
                dispatch({ type: REQUEST_SUCCESSFUL, payload: data.data });
                rootDispatch(startSession(data.data));
                rootDispatch(clearAlerts());
            } else {
                dispatch({ type: REQUEST_FAILED, error: errors });
                handleFailedRequest(errors[0], 5000);
            }
        } catch (error) {
            dispatch({ type: REQUEST_FAILED, error: error });
            console.log(error)
            handleFailedRequest(error, 5000);
        }
    }

    const handleForgotPassword = () => {
        // code goes here
    }

    useEffect(() => {
        if (session.isLogged && Object.keys(session.user).length > 0) {
            const role = session.user.role;
            navigate(ROLES[role]);
        }
    }, [session, navigate]);

    return (
        <div className="Login">
            <div className="login-form-container">
                <div className="left-container"></div>
                <div className="right-container">
                    <div className="login-form-desc">
                        <div>Login</div>
                        <div>Login to access membership area</div>
                    </div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { width: '100%', margin: "10px 0" },
                        }}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextField error={state.requestState.error != null} onChange={handleChange} type="text" name="username" label="Email" variant="outlined" />
                        <TextField InputProps={{ endAdornment: <div onClick={handleForgotPassword} style={{ width: "200px", textAlign: "right", fontSize: "12px", color: "gray" }}>Forgot Password?</div> }} sx={{ width: "100%" }} error={state.requestState.error != null} onChange={handleChange} type="password" name="password" label="Password" variant="outlined" />
                        <div style={{ fontSize: "small", color: "gray" }}>
                            <span>Don't have an account? </span>
                            <span style={{ fontWeight: 600, color: "var(--tae-orange)", cursor: "pointer" }}>Click here to register</span>
                        </div>
                        <div className="captcha-container">
                        </div>
                        <PrimaryButton variant="contained" loading={state.requestState.loading} type="submit">Login</PrimaryButton>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default Login;