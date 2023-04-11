import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader, Chip,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import StoreToken from '../../Util/Store';
import SnackBar from "../Components/SnackBar";


function CuisineChip(props) {
    return (
        <Box>
            <Chip
                sx={{ m: 1, }}
                label={props.data}
                variant="outlined"
                color={props.color}
                onClick={() => {props.function(props.data)}}
            />
        </Box>
    )
}
export default function RestaurantEditCuisinesPage() {

    const history = useNavigate();
    const [, setToken] = StoreToken();

    const [haveCuisines, setHaveCuisines] = React.useState([]);
    const [havenotCuisines, setHavenotCuisines] = React.useState([]);

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


    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/cuisine`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setHaveCuisines(response.data.added_cuisine_list)
                setHavenotCuisines(response.data.unadded_cuisine_list)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sign])

    const AddRequest = async (name) => {

        console.log(name)

        const body = {
            token: localStorage.getItem('token'),
            cuisine_name: name,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/profile/add_cuisine', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    // setToken(response.data.token);
                    setSign(!sign)
                    handleOpenSnack("Cuisine Added", "success")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    }

    const DeleteRequest = async (name) => {

        const body = {
            token: localStorage.getItem('token'),
            cuisine_name: name,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/profile/delete_cuisine', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    setSign(!sign)
                    handleOpenSnack("Cuisine Deleted", "warning")
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
                    // height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-cookie-bite fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Edit Cuisines'
                            subheader="select restaurant's cuisine"
                        />
                        <Divider/>
                        <CardContent>
                            <Box
                                my={4}
                            >
                                <Typography variant="h5" component="div">
                                    Added Cuisines
                                </Typography>
                                <Box
                                    sx={{
                                        width: 1,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    {haveCuisines.map((data) => {
                                        return (
                                            <CuisineChip data={data} function={DeleteRequest} color={"secondary"}/>
                                        );
                                    })}
                                </Box>
                            </Box>
                            <Divider />
                            <Box
                                my={4}
                            >
                                <Typography variant="h5" component="div">
                                    Other Cuisines
                                </Typography>
                                <Box
                                    sx={{
                                        width: 1,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    {havenotCuisines.map((data) => {
                                        return (
                                            <CuisineChip data={data} function={AddRequest} color={"default"}/>
                                        );
                                    })}
                                </Box>
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
