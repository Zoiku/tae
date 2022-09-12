import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardIcon, OrderIcon, RequestIcon, UsersIcon, HomeIcon } from "../Icons";

const AppNav = () => {
    const navigate = useNavigate();

    const [value, setValue] = useState('/admin/dashboard');
    const handleChange = (_event, value) => {
        setValue(value)
    };

    useEffect(() => {
        navigate(value);
    }, [navigate, value])

    return (
        <div className="AppNav">
            <Paper className='app-bar-container' sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
                <BottomNavigation
                    value={value}
                    showLabels
                    onChange={handleChange}
                >
                    <BottomNavigationAction value="/" label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction value="/admin/dashboard" label="Dashboard" icon={<DashboardIcon />} />
                    <BottomNavigationAction value="/admin/users" label="Users" icon={<UsersIcon />} />
                    <BottomNavigationAction value="/admin/requests" label="Request" icon={<RequestIcon />} />
                    <BottomNavigationAction value="/admin/orders" label="Orders" icon={<OrderIcon />} />
                </BottomNavigation>
            </Paper>
        </div>
    )
};

export default AppNav;