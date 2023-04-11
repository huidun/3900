import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider, FormControlLabel,
    InputAdornment, Switch,
    TextField,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import {Link} from "@mui/material";

import StoreToken from '../../Util/Store';

export default function LoginPage() {
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
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("id", response.data.id);
                    if (isCustomer) {
                        localStorage.setItem("type", "customer");
                        history('/restaurants/search')
                    } else {
                        localStorage.setItem("type", "restaurant");
                        history('/restaurant/profile')
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
                                    bgcolor: '#899668',
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
                            </Box>
                            <Box
                                my={4}
                            >
                                <TextField
                                    color="secondary"
                                    sx={{
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
                            <Box my={4} >
                                <FormControlLabel
                                    value="start"
                                    control={<Switch checked={!isCustomer} onChange={handleChangeIsCustomer} color="secondary" />}
                                    label="Sign in as Restaurant"
                                    labelPlacement="start"
                                />
                            </Box>
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
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography align='left' sx={{ width: '100%', }}>
                                    <Link underline="hover" onClick={() => {history('/password/update')}} >
                                        Forget password? Update with Email.
                                    </Link>
                                </Typography>
                                <Typography align='right' sx={{ width: '100%', }}>
                                    <Link underline="hover" onClick={() => {history('/signup')}}>
                                        Don’t have a free account? Sign up.
                                    </Link>
                                </Typography>
                            </Box>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
