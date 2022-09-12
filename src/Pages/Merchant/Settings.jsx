import "../../Styles/Settings.css";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Avatar from '@mui/material/Avatar';
import { StyledBadge } from "../../Material/Avatar";

import { SettingsPageUpdateButton, SettingsPageCancelButton, SettingsPageUpdateButtonSecondary } from "../../Material/Button";
import { useState } from "react";

const Settings = () => {
    const [updateProfileButton, setUpdateProfileButton] = useState(false);
    const toggleUpdate = (open) => (_event) => {
        setUpdateProfileButton(open);
    }

    return (
        <div className="Settings-Page">
            <div className="user-profile-container">
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar className="user-avatar" alt="User" src="/" />
                </StyledBadge>
                <div className="user-short-desc-container">
                    <div>User User</div>
                    <div>user@gmail.com</div>
                </div>
            </div>

            <div className="user-profile-sections-container">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { width: '100%', margin: "50px 0" },
                    }}
                    autoComplete="off"
                >

                    <section>
                        <div className="user-profile-section-title">Personal Details</div>
                        <div className="form-controller-input-duo form-controller">
                            <TextField fullWidth type="text" name="firstName" label="First Name" variant="outlined" />
                            <TextField fullWidth type="text" name="lastName" label="Last Name" variant="outlined" />
                        </div>
                        <div className="form-controller-input form-controller">
                            <TextField fullWidth type="text" name="email" label="Email" variant="outlined" />
                        </div>
                    </section>

                    <section>
                        <div className="user-profile-section-title">Company Details</div>
                        <div className="form-controller-input form-controller">
                            <TextField multiline rows={5} fullWidth type="text" name="company" label="Company Introduction" variant="outlined" />
                        </div>
                        <div className="form-controller-input-duo form-controller">
                            <TextField fullWidth type="text" name="companyName" label="Company Name" variant="outlined" />
                            <TextField fullWidth type="text" name="lastName" label="Company Address" variant="outlined" />
                        </div>
                        <div className="form-controller-input-duo form-controller">
                            <TextField fullWidth type="text" name="companyYear" label="Company Year" variant="outlined" />
                            <TextField fullWidth type="text" name="numOfEmployees" label="Number of Employees" variant="outlined" />
                        </div>
                        <div className="form-controller-input form-controller">
                            <TextField fullWidth type="text" name="company" label="Business Type" variant="outlined" />
                        </div>
                        <div className="form-controller-input form-controller">
                            <TextField fullWidth type="text" name="company" label="Supply Ability" variant="outlined" />
                        </div>
                    </section>

                    <section>
                        <div className="user-profile-section-title">Subscription</div>
                        <div className="form-controller-input form-controller">
                            <TextField fullWidth type="text" name="company" label="Company Introduction" variant="outlined" />
                        </div>
                        <div className="form-controller-input form-controller">
                            <TextField fullWidth type="text" name="company" label="Company Introduction" variant="outlined" />
                        </div>
                    </section>

                    <div className="settings-button-controller-container">
                        {
                            updateProfileButton ?
                                <>
                                    <SettingsPageUpdateButtonSecondary onClick={toggleUpdate(false)} className="settings-button-controller" variant="contained">Complete Profile Update</SettingsPageUpdateButtonSecondary>
                                    <SettingsPageCancelButton onClick={toggleUpdate(false)} className="settings-button-controller" variant="text">Cancel</SettingsPageCancelButton>
                                </>
                                :
                                <>
                                    <SettingsPageUpdateButton onClick={toggleUpdate(true)} className="settings-button-controller" variant="contained">Update Profile</SettingsPageUpdateButton>
                                </>
                        }
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default Settings;