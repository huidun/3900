import * as React from 'react';
import {
    Box,
    Button,
    CardContent,
    Divider, Grid,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import Card from "@mui/material/Card";
import ButtomBox from "../Components/ButtomBox";

function MenuCard(props) {

    return (
        <Card
            sx={{
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h5" component="div">
                        {props.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                        ${props.price}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}


export default function RestaurantMenuShowPage() {
    const history = useNavigate();

    const [menus, setMenus] = React.useState([])

    const { id } = useParams();


    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/menu/details`, {
            params: {
                id,
            },})
            .then((response) => {
                console.log(response);
                setMenus(response.data.all_dishes)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

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
                <ButtonAppBar color="primary" />
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
                        Menu
                    </Typography>
                    <Box
                        sx={{
                            m: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}>
                        <Button variant="contained" onClick={() => {history(`/restaurant/${id}`)}} >
                            back
                        </Button>
                    </Box>
                    <Divider/>
                    <Grid
                        container
                        sx={{
                            mt: 1,
                            mx: '5vw',
                            width: "90vw"
                        }}
                        spacing={5}
                    >
                        {menus.map((menu) => (
                            <Grid item xs={12} sm={6} md={3}>
                                <MenuCard
                                    name={menu.dish_name}
                                    price={menu.price}
                                    description={menu.description}
                                    id={menu.dish_id}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <ButtomBox />
                </Box>
            </Box>
        </React.Fragment>
    );
}
