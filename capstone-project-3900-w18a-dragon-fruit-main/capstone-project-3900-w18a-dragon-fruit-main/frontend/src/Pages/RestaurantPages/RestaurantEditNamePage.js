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

import StoreToken from '../../Util/Store';

export default function RestaurantEditNamePage() {

    const history = useNavigate();

    const [user, setUser] = React.useState({
        address: "",
        postcode: "",
        phone_number: "",
    });

    const [error, setError] = React.useState({
        postcodeError: false,
        postcodeMessage: " ",
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

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/profile/contacts`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setUser(prevState => ({
                    ...prevState,
                    address: response.data.address,
                    postcode: response.data.postcode,
                    phone_number: response.data.phone_number,
                }));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const SubmitRequest = async () => {

        // data['token'], data['name'], data['address'], data['postcode'], data['phone_number']
        const body = {
            token: localStorage.getItem('token'),
            name: user.name,
            address: user.address,
            postcode: user.postcode,
            phone_number: user.phone_number,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/profile/edit/contacts', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    history('/restaurant/profile')
                }
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    setError(prevState => ({
                        ...prevState,
                        postcodeError: false,
                        postcodeMessage: " ",
                    }));
                } else if (error.response.status === 400) {
                    setError(prevState => ({
                        ...prevState,
                        nameError: false,
                        nameMessage: " ",
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-pen-to-square fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Edit Contacts'
                            subheader="edit with new contacts"
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
                                    id="input_address"
                                    label="Address"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-location-dot fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.address}
                                    name='address'
                                    onChange={handleChange}
                                    helperText=" "
                                />
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='number'
                                    id="input_postcode"
                                    label="Postcode"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-location-dot fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.postcode}
                                    name='postcode'
                                    onChange={handleChange}
                                    error={error.postcodeError}
                                    helperText={error.postcodeMessage}
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
                                    type='tel'
                                    id="input_phone_number"
                                    label="Phone Number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-phone-flip fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.phone_number}
                                    name='phone_number'
                                    onChange={handleChange}
                                    helperText=" "
                                />
                            </Box>
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {
                                    history('/restaurant/profile')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ width: '100%', }}
                                onClick={() => {
                                    SubmitRequest();
                                }}
                            >
                                Submit
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
