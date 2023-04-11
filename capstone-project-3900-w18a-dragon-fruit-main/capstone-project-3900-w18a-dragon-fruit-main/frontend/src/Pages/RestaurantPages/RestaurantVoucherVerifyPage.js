import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    InputAdornment,
    TextField,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import VoucherDialog from "../Components/VoucherDialog";
import SnackBar from "../Components/SnackBar";

export default function RestaurantVoucherVerifyPage() {
    const history = useNavigate();

    const [voucher, setVoucher] = React.useState({
        email: "",
        verify: "",
    });

    const [error, setError] = React.useState({
        error: false,
        message: " ",
    });

    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };


    const handleChange = (event) => {
        setVoucher(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

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

    const SignupRequest = async () => {

        const body = {
            email: voucher.email,
            code: voucher.verify,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/restaurant/voucher/verify', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    setSelectedValue(response.data)
                    handleClickOpen();
                    setVoucher({
                        email: "",
                        verify: "",
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    }

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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-check-to-slot fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Voucher Verify'
                            subheader="verify voucher with code"
                        />
                        <Divider/>
                        <CardContent>
                            <Box
                                my={4}
                            >
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='text'
                                    id="input_verify"
                                    label="Code"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-qrcode fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={voucher.verify}
                                    name='verify'
                                    onChange={handleChange}
                                    error={error.passwordError}
                                    helperText={error.passwordMessage}
                                />
                            </Box>
                            <Box
                                my={4}
                            >
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='email'
                                    id="input_email"
                                    label="Email"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-at fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={voucher.email}
                                    name='email'
                                    onChange={handleChange}
                                    error={error.passwordError}
                                    helperText={error.passwordMessage}
                                />
                            </Box>
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {history("/restaurant/voucher")}}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ width: '100%', }}
                                onClick={() => {SignupRequest();}}
                            >
                                Verify
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
                <VoucherDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                />
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
