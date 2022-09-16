import "../../Styles/Register.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from "../../Material/Button";
import { useEffect, useReducer, useState } from "react";
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
import background from "../../Assets/background-2.png";

const Register = () => {
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
        dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: SEND_REQUEST })
        const authService = new AuthService();

        try {
            const { errors } = await authService.register(state.payload);
            if (errors.length === 0) {
                dispatch({ type: REQUEST_SUCCESSFUL });
                handleSuccessfulRequest("Successful", 2000);
            } else {
                dispatch({ type: REQUEST_FAILED, error: errors[0] });
                handleFailedRequest(errors[0], 2000);
            }
        } catch (error) {
            dispatch({ type: REQUEST_FAILED, error: error });
            handleFailedRequest(error, 2000);
        }
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

    useEffect(() => {
        const abortController = new AbortController();
        const fetch = async () => {
            try {
                const { data } = await axios.get("https://restcountries.com/v2/all", { signal: abortController.signal });
                setCountries(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetch();

        return () => abortController.abort();
    }, []);

    const list = () => (
        <Box
            sx={{ width: "auto", minHeight: "500px" }}
            role="presentation"
            className="drawer-container"
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
                        <TextField fullWidth label="Enter Code" variant="standard" />
                        <span style={{ fontSize: "12px", color: "gray" }}>Verifying the code and activate your account</span>
                    </div>
                </div>

                <div><PrimaryButton variant="contained" sx={{ width: "100%" }}>Verify</PrimaryButton></div>
            </div>
        </Box>
    );

    // const list = () => (
    //     <Box
    //         sx={{ width: "auto", minHeight: "500px" }}
    //         role="presentation"
    //         className="drawer-container"
    //     >
    //         <div className="drawer-title-container">
    //             <div>Complete Company Profile</div>
    //         </div>
    //         <div className="drawer-body">
    //             <div className="drawer-desc">
    //                 <div>Almost Done!</div>
    //                 <div>Please provide the following company details to complete setting up your merchant account.</div>
    //             </div>
    //             <div className="drawer-form-controller-container">
    //                 <div className="form-controller-duo-input">
    //                     <TextField fullWidth label="Year Established" variant="standard" />
    //                     <TextField fullWidth label="Number of Employees" variant="standard" />
    //                 </div>

    //                 <div className="form-controller-input">
    //                     <TextField InputProps={{ endAdornment: <div style={{ width: "300px", textAlign: "right", fontSize: "12px", color: "gray" }}>20ft per month</div> }} fullWidth label="Supply Ability" variant="standard" />
    //                 </div>

    //                 <div className="form-controller-input">
    //                     <TextField multiline rows={5} fullWidth label="Company History" variant="standard" />
    //                 </div>
    //             </div>

    //             <div><PrimaryButton variant="contained" sx={{ width: "100%" }}>Complete Profile</PrimaryButton></div>
    //         </div>
    //     </Box>
    // );

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
                            <TextField helperText="Enter your First Name" fullWidth error={state.requestState.error != null} onChange={handleChange} type="text" name="firstName" label="First Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField helperText="Enter your Last Name" fullWidth error={state.requestState.error != null} onChange={handleChange} type="text" name="lastName" label="Last Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField helperText="Enter valid Email Address" fullWidth error={state.requestState.error != null} onChange={handleChange} type="text" name="email" label="Email" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField
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
                                helperText="Your password must be at least 8 characters long" fullWidth error={state.requestState.error != null} onChange={handleChange} type={showPassword ? "text" : "password"} name="password" label="Password" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <TextField helperText="Name of Company" fullWidth error={state.requestState.error != null} onChange={handleChange} type="text" name="company" label="Company Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input">
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Country</InputLabel>
                                <Select name="country" label="Country" onChange={handleChange} value={'Ghana'}>
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
                                <Select fullWidth disabled>
                                    <MenuItem ></MenuItem>
                                </Select>
                                <FormHelperText sx={{ marginLeft: "20px" }}>
                                    Country Code
                                </FormHelperText>
                            </div>
                            <TextField helperText="8-15 characters" error={state.requestState.error != null} onChange={handleChange} type="text" name="telephone" label="Phone Number" variant="outlined" />
                        </div>

                        <div>
                            <FormGroup>
                                <FormControlLabel size="small" control={<Checkbox size="small" />} label="Agree to terms and conditions" />
                            </FormGroup>
                        </div>

                        <div className="captcha-container"></div>
                        <PrimaryButton onClick={toggleDrawer(true)} variant="contained" loading={state.requestState.loading}>Sign up</PrimaryButton>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default Register;