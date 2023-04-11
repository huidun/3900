import * as React from 'react';
import {
    Box,
    Button,
    Divider, InputAdornment, TextField,
    Typography,
} from "@mui/material";
import ButtonAppBar from './Components/LoadingHeader';
import SnackBar from './Components/SnackBar'

import ProfileLeft from "./Components/ProfileLeft";

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ButtomBox from "./Components/ButtomBox";


export default function ProfilePage() {
    const history = useNavigate();

    // const id = localStorage.getItem('id')

    const [error, setError] = React.useState({
        oldpasswordError: false,
        oldpasswordMessage: " ",
        newpasswordError: false,
        newpasswordMessage: " ",
        nameError: false,
        nameMessage: " ",
    });

    const [user, setUser] = React.useState({
        name: "",
        email: "",
        old_password: "",
        new_password: "",
    });

    const handleChange = (event) => {
        setUser(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const [snack, setSnack] = React.useState({
        message: "",
        open: false,
    })

    const handleCloseSnack = () => {
        setSnack(prevState => ({
            ...prevState,
            open: false,
        }));
    }

    const handleOpenSnack = (message) => {
        setSnack(prevState => ({
            open: true,
            message: message,
        }));
    }

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/profile/details`, {
            params: {
                id: localStorage.getItem('id'),
                type: localStorage.getItem('type') === 'customer',
            },})
            .then((response) => {
                console.log(response);
                setUser(prevState => ({
                    ...prevState,
                    name: response.data.name,
                    email: response.data.email,
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const UpdateNameRequest = async () => {

        const body = {
            token: localStorage.getItem('token'),
            name: user.name,
            type: localStorage.getItem('type') === 'customer',

        }

        await axios.put('http://127.0.0.1:8000/profile/edit/name', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    handleOpenSnack("Name Changed")
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const UpdatePasswordRequest = async () => {

        const body = {
            token: localStorage.getItem('token'),
            old_password: user.old_password,
            new_password: user.new_password,
            type: localStorage.getItem('type') === 'customer',
        }

        await axios.put('http://127.0.0.1:8000/profile/edit/password', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setUser(prevState => ({
                        ...prevState,
                        old_password: '',
                        new_password: '',
                    }));
                    setError(prevState => ({
                        ...prevState,
                        oldpasswordError: false,
                        oldpasswordMessage: " ",
                        newpasswordError: false,
                        newpasswordMessage: " ",
                    }));
                    handleOpenSnack("Password Changed")
                }
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    setError(prevState => ({
                        ...prevState,
                        newpasswordError: true,
                        newpasswordMessage: error.response.data.description,
                        oldpasswordError: false,
                        oldpasswordMessage: " ",
                        nameError: false,
                        nameMessage: " ",
                    }));
                } else if (error.response.status === 400) {
                    setError(prevState => ({
                        ...prevState,
                        oldpasswordError: true,
                        oldpasswordMessage: error.response.data.description,
                        nameError: false,
                        nameMessage: " ",
                        newpasswordError: false,
                        newpasswordMessage: " ",
                    }));
                } else if (error.response.status === 403) {
                    setError(prevState => ({
                        ...prevState,
                        nameError: true,
                        nameMessage: error.response.data.description,
                        oldpasswordError: false,
                        oldpasswordMessage: " ",
                        newpasswordError: false,
                        newpasswordMessage: " ",
                    }));
                }
            });
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: 1,
                    // height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
            >
                <ButtonAppBar color="primary"/>
                <Box
                    // position='fixed'
                    sx={{
                        mt: '10vh',
                        width: 1,
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography variant='h1' align='center' sx={{ color: 'primary.dark'}} gutterBottom>
                        Profile
                    </Typography>
                    <Box
                        sx={{
                            width: 1,
                            // height: "100vh",
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'center',
                        }}
                    >
                        <ProfileLeft select={'Profile'}/>
                        <Divider orientation="vertical" flexItem />
                        <Divider />
                        <Box
                            sx={{
                                px: '3%',
                                // width: { xs: '100%', sm: '70%' },
                                flexGrow: 1,
                                // height: "100vh",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Typography mt={{ xs: 3, sm: 0 }} variant='h4' sx={{ fontFamily: 'Georgia', }}>Basic Profile</Typography>
                            <Box mt={3}>
                                <Typography variant='h5' sx={{ fontFamily: 'Georgia', }}>Name</Typography>
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='text'
                                    id="input_name"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-circle-user fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.name}
                                    name='name'
                                    onChange={handleChange}
                                    error={error.nameError}
                                    helperText={error.nameMessage}
                                />
                            </Box>
                            <Box mt={3}>
                                <Typography variant='h5' sx={{ fontFamily: 'Georgia', }}>Email</Typography>
                                <TextField
                                    disabled
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='email'
                                    id="input_email"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-at fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.email}
                                    name='email'
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box
                                my={3}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button variant="contained" onClick={() => {UpdateNameRequest()}}>Update</Button>
                            </Box>
                            <Divider />
                            <Typography variant='h4' mt={5} sx={{ fontFamily: 'Georgia', }}>Update Password</Typography>
                            <Box mt={3}>
                                <Typography variant='h5' sx={{ fontFamily: 'Georgia', }}>Current password</Typography>
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='password'
                                    id="input_old_password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-key fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.old_password}
                                    name='old_password'
                                    onChange={handleChange}
                                    error={error.oldpasswordError}
                                    helperText={error.oldpasswordMessage}
                                />
                            </Box>
                            <Box mt={3}>
                                <Typography variant='h5' sx={{ fontFamily: 'Georgia', }}>New password</Typography>
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='password'
                                    id="input_new_password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-key fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.new_password}
                                    name='new_password'
                                    onChange={handleChange}
                                    error={error.newpasswordError}
                                    helperText={error.newpasswordMessage}
                                />
                            </Box>
                            <Box
                                my={3}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button variant="contained" onClick={() => {UpdatePasswordRequest()}}>Update</Button>
                            </Box>
                            <ButtomBox/>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <SnackBar
                function={handleCloseSnack}
                open={snack.open}
                message={snack.message}
                severity={'success'}
            />
        </React.Fragment>
    );
}
