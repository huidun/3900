import * as React from 'react';
import {
    Box,
    Divider,
    Grid,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';
import RestaurantCard from "../Components/RestaurantCard";

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ButtomBox from "../Components/ButtomBox";
import RestaurantListButtons from "../Components/RestaurantListButtons";

function ListShow(restaurants) {
    return (
        restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={3}>
                <RestaurantCard
                    id={restaurant.restaurant_id}
                    name={restaurant.restaurant_name}
                    overview={restaurant.description}
                    like={restaurant.liked}
                    rate={restaurant.rating}
                    image={restaurant.picture}
                />
            </Grid>
        )));
}

export default function RestaurantRecommendPage() {
    const history = useNavigate();

    const [restaurants, setReataurant] = React.useState([])

    const [sign, setSign] = React.useState(true)

    const [value, setValue] = React.useState("")

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {

        axios.get(`http://127.0.0.1:8000/search`, {
            params: {
                token: localStorage.getItem('token'),
                keyword: value,
            },})
            .then((response) => {
                console.log(response);
                setReataurant(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
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
                <RestaurantListButtons/>
                <Box
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
                    <Divider />
                    <Grid
                        container
                        sx={{my: 1,}}
                        spacing={5}
                    >
                        {ListShow(restaurants)}
                    </Grid>
                    <ButtomBox />
                </Box>
            </Box>
        </React.Fragment>
    );
}
