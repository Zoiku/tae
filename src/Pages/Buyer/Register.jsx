import "../../Styles/Register.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from "../../Material/Button";
import { useEffect, useReducer, useState, useRef } from "react";
import { INITIAL_STATE, formReducer } from "../../Reducers/FormReducer";
import { INPUTING, SEND_REQUEST, REQUEST_SUCCESSFUL, REQUEST_FAILED } from "../../Reducers/Actions";
import AuthService from "../../Services/Auth";
import { useDispatch } from "react-redux";
import { setAlert } from "../../Redux/Features/Alert.js"
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import background from "../../Assets/background-1.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const resendCodeTimerInterval = useRef(null);
    const [resendCodeTimer, setResendCodeTimer] = useState({ seconds: 60 });
    const defaultCountryData = { country: "Ghana", countryCode: "233" };
    const navigate = useNavigate();
    const [consent, setConsent] = useState(false);
    const rootDispatch = useDispatch();
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
    const [countries, setCountries] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (open) => (_event) => {
        setOpenDrawer(open);
    };

    const handleChange = (e) => {
        if (e.target.name === "country") {
            countries.map(country => {
                if (country.name === state.payload.country) {
                    const callingCode = country.callingCodes[0];
                    handleManualChange("countryCode", callingCode);
                }
                return 1;
            })
        }
        dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value });
    };

    const handleManualChange = (prop, value) => {
        dispatch({ type: INPUTING, prop, value });
    };

    const handleSubmit = async (e) => {
        dispatch({ type: SEND_REQUEST })
        e.preventDefault();
        state.payload = {
            ...state.payload,
            username: state.payload.email,
            mobileNo: state.payload.countryCode ? `${state.payload.countryCode} ${state.payload.telephone}` : `${defaultCountryData.countryCode} ${state.payload.telephone}`,
            country: state.payload.country ? state.payload.country : defaultCountryData.country,
            role: "BUYER",
        }
        const authService = new AuthService();
        try {
            const { errors } = await authService.register(state.payload);
            if (errors.length === 0) {
                setOpenDrawer(true);
                dispatch({ type: REQUEST_SUCCESSFUL });
                handleSuccessfulRequest("Successful", 5000);
            } else {
                dispatch({ type: REQUEST_FAILED, error: errors[0].response.data.message });
                handleFailedRequest(errors[0].response.data.message, 5000);
            }
        } catch (error) {
            dispatch({ type: REQUEST_FAILED, error: error });
            // handleFailedRequest(error, 2000);
        }
    };

    const initCounddown = () => {
        if (!resendCodeTimerInterval.current) {
            resendCodeTimerInterval.current = setInterval(() => {
                if (resendCodeTimer.seconds > 0) {
                    setResendCodeTimer(({ seconds }) => ({ ...resendCodeTimer, seconds: seconds - 1 }))
                }else {
                    console.log('Hmm')
                }
            }, 1000);
        }
    }

    const handleResend = async () => {
        const authService = new AuthService();
        try {
            const { errors } = await authService.resendVerificationCode(state.payload.email);
            if (errors.length === 0) {
                initCounddown();
            }
        }
        catch (error) { }
    }

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        dispatch({ type: SEND_REQUEST });
        const authService = new AuthService();
        try {
            const { email, role, verificationCode } = state.payload;
            const { errors } = await authService.verifyCode(verificationCode, email, role);
            if (errors.length === 0) {
                setOpenDrawer(false);
                handleVerificationSuccessfull("Success", 3000);
                dispatch({ type: REQUEST_SUCCESSFUL });
                navigate("/login");
            } else {
                initCounddown();
                handleVerificationFailed("Could not verify code", 5000);
                dispatch({ type: REQUEST_FAILED, error: "Could not verify code" });
            }
        } catch (_error) {
            initCounddown();
            handleVerificationFailed("Could not verify code", 5000);
            dispatch({ type: REQUEST_FAILED, error: "Could not verify code" });
        }
    }

    const handleVerificationSuccessfull = (message, timeOut) => {
        const payload = {
            severity: "success",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const handleVerificationFailed = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const handleFailedRequest = (message, timeOut) => {
        const payload = {
            severity: "error",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const handleSuccessfulRequest = (message, timeOut) => {
        const payload = {
            severity: "success",
            message,
            timeOut
        }
        rootDispatch(setAlert(payload));
    };

    const toggleConsent = () => {
        setConsent(prev => !prev);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const { data } = await axios.get("https://restcountries.com/v2/all", { signal: abortController.signal });
                setCountries(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        return () => abortController.abort();
    }, []);

    const list = () => (
        <Box
            component="form"
            sx={{ width: "auto", minHeight: "500px" }}
            role="presentation"
            className="drawer-container"
            onSubmit={handleCodeVerification}
            autoComplete="off"
        >
            <div className="drawer-title-container">
                <div>Verify Account</div>
                <div><CloseIcon className="close-icon" onClick={toggleDrawer(false)} /></div>
            </div>
            <div className="drawer-body">
                <div className="drawer-desc">
                    <div>Almost Done!</div>
                    <div>We've sent the code to <span style={{ color: "#ee9b00", fontWeight: 500 }}>{state.payload.email}</span></div>
                </div>
                <div className="drawer-form-controller-container">
                    <div className="form-controller-input">
                        <TextField required error={state.requestState.error !== null} InputProps={{ endAdornment: <IconButton className="registration-resend-container" onClick={handleResend} size="small">resend ({resendCodeTimer.seconds})</IconButton> }} name="verificationCode" onChange={handleChange} fullWidth label="Enter Code" variant="standard" />
                        <span style={{ fontSize: "12px", color: "gray" }}>Verifying the code and activate your account</span>
                    </div>
                </div>
                <div><PrimaryButton loading={state.requestState.loading} type="submit" variant="contained" sx={{ width: "100%" }}>Verify</PrimaryButton></div>
            </div>
        </Box >
    );

    return (
        <div className="Register">
            <div>
                <Drawer
                    className="drawer"
                    variant="temporary"
                    anchor="bottom"
                    open={openDrawer}
                >
                    {list()}
                </Drawer>
            </div>

            <div className="register-form-container">
                <div className="left-container">
                    <img src={background} alt="tae tae tea" />
                </div>
                <div className="right-container">
                    <div className="register-form-desc">
                        <div>Sign Up</div>
                        <div>Merchant</div>
                    </div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { width: '100%', margin: "15px 0" },
                        }}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-controller-input">
                            <TextField required helperText="Enter your First Name" fullWidth onChange={handleChange} type="text" name="firstName" label="First Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField required helperText="Enter your Last Name" fullWidth onChange={handleChange} type="text" name="lastName" label="Last Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField required helperText="Enter valid Email Address" fullWidth onChange={handleChange} type="text" name="email" label="Email" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
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
                        </div>
                        <div className="form-controller-input">
                            <TextField required helperText="Name of Company" fullWidth onChange={handleChange} type="text" name="companyName" label="Company Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Country</InputLabel>
                                <Select required name="country" label="Country" onChange={handleChange} value={state.payload.country ? state.payload.country : defaultCountryData.country}>
                                    {
                                        countries &&
                                        countries.map(country =>
                                            <MenuItem key={country.name} value={country.name}>
                                                <div style={{ display: "flex", alignItems: "center" }}><img style={{ marginRight: 10 }} alt={country.name} width={30} src={country.flags.svg} /> {country.name}</div>
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                                <FormHelperText sx={{ marginLeft: "20px" }}>
                                    Select Country
                                </FormHelperText>
                            </FormControl>
                        </div>
                        <div className="form-controller-duo-input">
                            <div>
                                <Select fullWidth disabled value={defaultCountryData.countryCode}>
                                    <MenuItem value={defaultCountryData.countryCode}>+{defaultCountryData.countryCode}</MenuItem>
                                </Select>
                                <FormHelperText sx={{ marginLeft: "20px" }}>
                                    Country Code
                                </FormHelperText>
                            </div>
                            <TextField required helperText="8-15 characters" onChange={handleChange} type="text" name="telephone" label="Phone Number" variant="outlined" />
                        </div>

                        <div>
                            <FormGroup>
                                <FormControlLabel size="small" control={<Checkbox required checked={consent} onChange={toggleConsent} size="small" />} label="Agree to terms and conditions" />
                            </FormGroup>
                        </div>

                        <div className="captcha-container"></div>
                        <PrimaryButton disabled={!consent} type="submit" variant="contained" loading={state.requestState.loading}>Sign up</PrimaryButton>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default Register;