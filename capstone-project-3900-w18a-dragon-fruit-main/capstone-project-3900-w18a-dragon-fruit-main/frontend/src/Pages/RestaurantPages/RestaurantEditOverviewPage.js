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
    TextField,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

export default function RestaurantEditOverviewPage() {

    const history = useNavigate();

    const [overview, setOverview] = React.useState("");

    const [error, setError] = React.useState({
        error: false,
        message: " ",
    });

    const handleChange = (event) => {
        setOverview(event.target.value);
    };

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/profile/overview`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setOverview(response.data.description)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const SubmitRequest = async () => {

        // data['token'], data['name'], data['address'], data['postcode'], data['phone_number']
        const body = {
            token: localStorage.getItem('token'),
            description: overview,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/profile/edit/description', JSON.stringify(body),
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
                if (error.response.status === 400) {
                    setError(prevState => ({
                        ...prevState,
                        error: true,
                        message: error.response.data.description,
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
                            title='Edit Overview'
                            subheader="edit new overview"
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
                                    id="input_overview"
                                    label="Overview"
                                    variant="outlined"
                                    value={overview}
                                    name='overview'
                                    multiline
                                    rows={6}
                                    onChange={handleChange}
                                    error={error.error}
                                    helperText={error.message}
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
