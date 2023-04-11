import * as React from 'react';
import {
    Box,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField, Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantCard from "../Components/RestaurantCard";

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import ButtomBox from "../Components/ButtomBox";
import RestaurantListButtons from "../Components/RestaurantListButtons";


export default function RestaurantListPage() {
    const history = useNavigate();

    const { id } = useParams();

    const [restaurants, setReataurant] = React.useState([])

    const [sign, setSign] = React.useState(true)

    const [value, setValue] = React.useState("")

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {
        if (id === 'search') {
            axios.get(`http://127.0.0.1:8000/search`, {
                params: {
                    token: localStorage.getItem('token') ? localStorage.getItem('token') : "",
                    keyword: value,
                },})
                .then((response) => {
                    console.log(response);
                    setReataurant(response.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (id === 'toplist') {
            axios.get(`http://127.0.0.1:8000/recommendation/rating`, {
                params: {
                    id: localStorage.getItem('id'),
                },})
                .then((response) => {
                    console.log(response);
                    setReataurant(response.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (id === 'cuisine') {
            axios.get(`http://127.0.0.1:8000/recommendation/preference`, {
                params: {
                    id: localStorage.getItem('id'),
                },})
                .then((response) => {
                    console.log(response);
                    setReataurant(response.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [sign])

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: 1,
                    height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
            >
                <ButtonAppBar color="primary"/>
                <RestaurantListButtons function={() => {setSign(!sign)}}/>
                <Box
                    // position='fixed'
                    sx={{
                        mt: '10vh',
                        mx: '5vw',
                        width: "90vw",
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography
                        // position='fixed'
                        variant='h4'
                        gutterBottom
                        sx={{
                            width: '100%',
                            display: id === 'toplist' ? 'flex' : 'none'
                        }}
                        align='center'
                    >
                        Our Highest Rated Restaurants
                    </Typography>
                    <Typography
                        // position='fixed'
                        variant='h4'
                        gutterBottom
                        sx={{
                            width: '100%',
                            display: id === 'cuisine' ? 'flex' : 'none'
                        }}
                        align='center'
                    >
                        Recommended Restaurants Based On Your History
                    </Typography>
                    <Box
                        // position='fixed'
                        sx={{
                            width: '100%',
                            display: id === 'search' ? 'flex' : 'none',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <TextField
                            color="secondary"
                            sx={{
                                // width: 1,
                                flexGrow: 1,
                                mb: 4,
                            }}
                            type='search'
                            id="search"
                            label="search"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton>
                                            <SearchIcon onClick={() => {setSign(!sign)}}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            value={value}
                            name='search'
                            onChange={handleChange}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    setSign(!sign)
                                }
                            }}
                        />
                    </Box>
                    <Divider />
                    <Grid
                        container
                        sx={{my: 1,}}
                        spacing={5}
                    >
                        {restaurants.map((restaurant) => (
                            <Grid item xs={12} sm={6} md={3}>
                                <RestaurantCard
                                    id={restaurant.restaurant_id}
                                    name={restaurant.restaurant_name}
                                    overview={restaurant.description}
                                    like={restaurant.liked}
                                    rate={restaurant.rating}
                                    image={restaurant.picture}
                                    functionget={() => {setSign(!sign)}}
                                />
                            </Grid>))
                        }
                    </Grid>
                    <ButtomBox />
                </Box>
            </Box>
        </React.Fragment>
    );
}
