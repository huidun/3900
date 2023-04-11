import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import CommentRating from "../Components/CommentRating";

export default function CustomerVouchersCommentPage() {
    const history = useNavigate();

    const { id } = useParams();

    const [value, setValue] = React.useState({
        rating: 2.5,
        commenting: "",
    })

    const handleChangeCommenting = (event) => {
        setValue(prevState => ({
            ...prevState,
            commenting: event.target.value,
        }));
    };

    const handleChangeRating = (event) => {
        setValue(prevState => ({
            ...prevState,
            rating: event.target.value,
        }));
    };

    const [error, setError] = React.useState({
        error: false,
        message: " ",
    });

    const SubmitRequest = async () => {
        const body = {
            token: localStorage.getItem('token'),
            rate: value.rating,
            v_id: id,
            review: value.commenting,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/comment/customer/add', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    // setSign(!sign)
                    history(-1)
                }
            })
            .catch((error) => {
                console.log(error)
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-star-half-stroke fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Comment'
                            subheader="Rating and Commenting"
                        />
                        <Divider/>
                        <CardContent>
                            <Typography variant="h5" component="div" >
                                Rating:
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <CommentRating size={'large'} value={value.rating} onChange={handleChangeRating} precision={0.1}/>
                            </Box>
                            <Typography variant="h5" component="div" >
                                Commenting:
                            </Typography>
                            <TextField
                                color="secondary"
                                sx={{
                                    width: '100%',
                                }}
                                type='text'
                                id="input_overview"
                                variant="outlined"
                                value={value.commenting}
                                name='commenting'
                                multiline
                                rows={6}
                                onChange={handleChangeCommenting}
                                error={error.error}
                                helperText={error.message}
                            />
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {history(-1)}}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ width: '100%', }}
                                onClick={() => {SubmitRequest()}}
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
