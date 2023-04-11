import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    InputAdornment, Step, StepLabel, Stepper,
    TextField,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SnackBar from "../Components/SnackBar";


export default function UpdatePasswordPage() {
    const history = useNavigate();
    // const [, setToken] = StoreToken();
    const [snack, setSnack] = React.useState({
        message: "",
        open: false,
        severity: 'success',
    })

    const handleCloseSnack = () => {
        setSnack(prevState => ({
            ...prevState,
            open: false,
        }));
    }

    const handleOpenSnack = (message, severity) => {
        setSnack(prevState => ({
            open: true,
            message: message,
            severity: severity,
        }));
    }

    const steps = ['Enter your Email', 'Enter the Code', 'Enter new password'];

    const [user, setUser] = React.useState({
        email: "",
        code: "",
        password: "",
    });

    const [error, setError] = React.useState({
        passwordError: false,
        passwordMessage: " ",
        emailError: false,
        emailMessage: " ",
    });

    const handleChange = (event) => {
        setUser(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleEmailNext = async () => {
        const body = {
            email: user.email,
        }

        await axios.post('http://127.0.0.1:8000/auth/passwordreset/request', JSON.stringify(body),
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    };

    const handleResetNext = async () => {

        const body = {
            email: user.email,
            reset_code: user.code,
            new_password: user.password,
        }
        await axios.post('http://127.0.0.1:8000/auth/passwordreset/reset', JSON.stringify(body),
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: 1,
                    height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <ButtonAppBar color="primary" />
                <Box
                    position='fixed'
                    sx={{
                        width: 1,
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        // variant="outlined"
                        sx={{
                            color: "#000",
                            width: { xs: '75%', sm: '50%' },
                            // backgroundImage: 'linear-gradient(to right bottom, #ee3f4d, #5dbe8a)',
                            // width: 1,
                            // height: "75%",
                        }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: '#899668',
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-key fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Update Password'
                            subheader="update password by email"
                        />
                        <Divider/>
                        <CardContent>
                            <Stepper activeStep={activeStep}>
                                <Step key='a'>
                                    <StepLabel>Enter your Email</StepLabel>
                                </Step>
                                <Step key='b'>
                                    <StepLabel>Enter the Code</StepLabel>
                                </Step>
                                <Step key='c'>
                                    <StepLabel>Enter new password</StepLabel>
                                </Step>
                            </Stepper>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 10, mb: 10 }} align='center' variant='h5'>
                                        All steps completed - your password has been changed
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Box
                                        my={4}
                                    >
                                        <TextField
                                            color="secondary"
                                            sx={{
                                                display: activeStep === 0 ? 'flex' : 'none',
                                                width: '100%',
                                            }}
                                            type='email'
                                            id="input_email"
                                            label="E-mail"
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
                                            error={error.passwordError}
                                            helperText={error.passwordMessage}
                                        />
                                        <TextField
                                            color="secondary"
                                            sx={{
                                                display: activeStep === 1 ? 'flex' : 'none',
                                                width: '100%',
                                            }}
                                            type='text'
                                            id="input_code"
                                            label="Code"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box className="fa-solid fa-envelope-open-text fa-lg"/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            value={user.code}
                                            name='code'
                                            onChange={handleChange}
                                            error={error.emailError}
                                            helperText={error.emailMessage}
                                        />
                                        <TextField
                                            color="secondary"
                                            sx={{
                                                display: activeStep === 2 ? 'flex' : 'none',
                                                width: '100%',
                                            }}
                                            type='password'
                                            id="input_password"
                                            label="Password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box className="fa-solid fa-key fa-lg"/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            variant="outlined"
                                            value={user.password}
                                            name='password'
                                            onChange={handleChange}
                                            error={error.emailError}
                                            helperText={error.emailMessage}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            // color="secondary"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            startIcon={<ChevronLeftIcon />}
                                            sx={{ mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button sx={{display: activeStep === 0 ? 'flex' : 'none',}} onClick={handleEmailNext} variant="contained" endIcon={<ChevronRightIcon />}>
                                            Next
                                        </Button>
                                        <Button sx={{display: activeStep === 1 ? 'flex' : 'none',}} onClick={handleNext} variant="contained" endIcon={<ChevronRightIcon />}>
                                            Next
                                        </Button>
                                        <Button sx={{display: activeStep === 2 ? 'flex' : 'none',}} onClick={handleResetNext} variant="contained" endIcon={<ChevronRightIcon />}>
                                            Finish
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {history(-1)}}
                            >
                                Back
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
            <SnackBar
                function={handleCloseSnack}
                open={snack.open}
                message={snack.message}
                severity={snack.severity}
            />
        </React.Fragment>
    );
}
