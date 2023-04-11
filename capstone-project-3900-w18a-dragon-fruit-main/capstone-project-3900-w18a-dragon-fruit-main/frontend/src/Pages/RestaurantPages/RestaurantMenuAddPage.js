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

export default function RestaurantMenuAddPage() {

    const history = useNavigate();

    const [user, setUser] = React.useState({
        name: "",
        price: "",
        description: "",
    });

    const [error, setError] = React.useState({
        nameError: false,
        nameMessage: " ",
        priceError: false,
        priceMessage: " ",
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

    const SubmitRequest = async () => {

        // data['token'], data['dish_name'], data['price'],  data['description']
        const body = {
            token: localStorage.getItem('token'),
            dish_name: user.name,
            price: user.price,
            description: user.description,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/menu/add_dish', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    history('/restaurant/menu')
                }
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    setError(prevState => ({
                        priceError: true,
                        priceMessage: error.response.data.description,
                        nameError: false,
                        nameMessage: " ",
                    }));
                } else if (error.response.status === 400) {
                    setError(prevState => ({
                        nameError: true,
                        nameMessage: error.response.data.description,
                        priceError: false,
                        priceMessage: " ",
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-plate-wheat fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Add Menu'
                            subheader="add Menu here"
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
                                    id="input_name"
                                    label="Name"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-utensils fa-lg"/>
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
                            <Box
                                my={4}
                            >
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: '100%',
                                    }}
                                    type='number'
                                    id="input_price"
                                    label="Price"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Box className="fa-solid fa-dollar-sign fa-lg"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={user.price}
                                    name='price'
                                    onChange={handleChange}
                                    error={error.priceError}
                                    helperText={error.priceMessage}
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
                                    type='text'
                                    id="input_description"
                                    label="Description"
                                    variant="outlined"
                                    value={user.description}
                                    name='description'
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    error={error.nameError}
                                    helperText={error.nameMessage}
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
                                    history('/restaurant/menu')
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
