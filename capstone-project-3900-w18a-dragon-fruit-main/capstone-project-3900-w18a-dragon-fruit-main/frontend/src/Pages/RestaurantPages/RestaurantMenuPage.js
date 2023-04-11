import * as React from 'react';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Divider, Grid,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Card from "@mui/material/Card";
import SnackBar from "../Components/SnackBar";
import ProfileLeft from "../Components/ProfileLeft";
import ButtomBox from "../Components/ButtomBox";

function MenuCard(props) {
    const history = useNavigate();
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
                    <Typography variant="h5" component="div" >
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
            <CardActions
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Button size="small" onClick={() => {history(`/restaurant/menu/${props.id}/change`)}}>Change</Button>
                <Button size="small" onClick={() => {props.function(props.id)}}>Delete</Button>
            </CardActions>
        </Card>
    );
}

export default function RestaurantProfilePage() {
    const history = useNavigate();

    const [menus, setMenus] = React.useState([])

    const [sign, setSign] = React.useState(false)

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

    const deleteRequest = async (id) => {

        const body = {
            token: localStorage.getItem('token'),
            dish_id: id,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/menu/delete_dish', JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8;'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setSign(!sign)
                    handleOpenSnack("Menu Deleted", "warning")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack("Error: Cannot Delete Menu", "error")
            });
    }


    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/menu/details`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setMenus(response.data.all_dishes)
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
                            width: 1,
                            // height: "100vh",
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'center',
                        }}
                    >
                        <ProfileLeft select={'Menu'}/>
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
                            <Button my={3} variant="contained" onClick={() => {history('/restaurant/menu/add')}} >
                                ADD
                            </Button>
                            <br/>
                            <Divider/>
                            <Grid
                                container
                                sx={{
                                    mt: 1,
                                    height: '80vh'
                                }}
                                spacing={3}
                            >
                                {menus.map((menu) => (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <MenuCard
                                            name={menu.dish_name}
                                            price={menu.price}
                                            description={menu.description}
                                            id={menu.dish_id}
                                            function={deleteRequest}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <ButtomBox />
                        </Box>
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
