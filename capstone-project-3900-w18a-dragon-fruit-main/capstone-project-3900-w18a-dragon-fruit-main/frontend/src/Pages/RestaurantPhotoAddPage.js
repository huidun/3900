import * as React from 'react';
// import parse from "html-react-parser";
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
import ButtonAppBar from './Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import StoreToken from '../Util/Store';

export default function RestaurantPhotoAddPage() {
    const history = useNavigate();
    const [, setToken] = StoreToken();

    const [user, setUser] = React.useState({
        email: "",
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

    const [isCustomer, setIsCustomer] = React.useState(true);

    const handleChangeIsCustomer = () => {
        setIsCustomer(!isCustomer);
    };

    const SignupRequest = async () => {

        const body = {
            email: user.email,
            password: user.password,
            type: isCustomer,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/auth/login', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setToken(response.data.token);
                    localStorage.setItem("id", response.data.id);
                    if (isCustomer) {
                        localStorage.setItem("type", "customer");
                        history('/customer')
                    } else {
                        localStorage.setItem("type", "restaurant");
                        history('/restaurant/home')
                    }
                    // console.log(response);
                }
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 400) {
                    setError(prevState => ({
                        ...prevState,
                        passwordError: true,
                        passwordMessage: error.response.data.description,
                        emailError: false,
                        emailMessage: " ",
                    }));
                } else if (error.response.status === 401) {
                    setError(prevState => ({
                        ...prevState,
                        passwordError: false,
                        passwordMessage: " ",
                        emailError: true,
                        emailMessage: error.response.data.description,
                    }));
                }
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
                                    bgcolor: '#5dbe8a',
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-user-plus fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Sign in'
                            subheader="sign in here with email"
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
                                    type='file'
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
                            </Box>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload File
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                />
                            </Button>
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
                                variant="contained"
                                sx={{ width: '100%', }}
                                onClick={() => {SignupRequest();}}
                            >
                                Sign in
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
