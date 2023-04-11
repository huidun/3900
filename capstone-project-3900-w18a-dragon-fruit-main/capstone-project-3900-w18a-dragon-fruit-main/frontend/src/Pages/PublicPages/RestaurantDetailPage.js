import * as React from 'react';
import {
    Box, Button, Chip,
    Divider, FormControl,
    Grid, InputLabel, Select,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import Comment from "../Components/Comment";
import ButtomBox from "../Components/ButtomBox";
import CommentRating from "../Components/CommentRating";
import MenuItem from "@mui/material/MenuItem";

export default function RestaurantDetailPage(props) {
    const history = useNavigate();
    // const id = props.match.params.id;
    const { id } = useParams();

    const [show, setShow] = React.useState(false)

    const [order, setOrder] = React.useState('time');

    const [value, setValue] = React.useState(0);

    const handleChangeOrder = (event) => {
        setOrder(event.target.value);
    };


    const [restaurant, setRestaurant] = React.useState(
        {
            name: '',
            email: '',
            address: '',
            postcode: 0,
            phone_number: '',
            description: '',
            picture: '',
        }
    )

    const [cuisines, setCuisines] = React.useState([]);

    const [comments, setComments] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/profile/details`, {
            params: {
                id,
            },})
            .then((response) => {
                console.log(response);
                setRestaurant(prevState => ({
                    ...prevState,
                    name: response.data.name,
                    email: response.data.email,
                    address: response.data.address,
                    postcode: response.data.postcode,
                    phone_number: response.data.phone_number,
                    description: response.data.description,
                    picture: response.data.picture,
                }));
                setCuisines(response.data.cuisine)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/comment/details/orderby`, {
            params: {
                r_id: id,
                condition: order,
            },})
            .then((response) => {
                console.log(response);
                setComments(response.data.comments)
                setValue(response.data.total)
                // setData(response.data.rate)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [order])

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
                        // mx: '5vw',
                        width: "100vw",
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography variant='h1' align='center' sx={{ color: 'primary.dark'}} gutterBottom>
                        {restaurant.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Box
                            sx={{
                                mx: { xs: '5vw', sm: '2.5vw' },
                                width:  { xs: '90vw', sm: '45vw' },
                                // flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Box my={2}
                                 sx={{
                                     '&:hover': {
                                         boxShadow: 5,
                                     },
                                 }}
                            >
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={restaurant.picture}
                                    alt={restaurant.name}
                                />
                            </Box>
                            <Button variant="contained" my={2} onClick={() => {history(`/restaurant/${id}/photo`)}}>More</Button>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box
                            sx={{
                                mx: { xs: '5vw', sm: '2.5vw' },
                                width:  { xs: '90vw', sm: '45vw' },
                                flexGrow: 1,
                            }}
                        >
                            <Box my={2} >
                                <Typography variant="h4" component="div">
                                    Cuisines
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
                                    {cuisines.map((data) => {
                                        return (
                                            // <ListItem key={data.key}>
                                                <Chip
                                                    sx={{
                                                        m: 1,
                                                        '&:hover': {
                                                            boxShadow: 1,
                                                            color: 'secondary.dark'
                                                        },
                                                    }}
                                                    label={data}
                                                    variant="outlined"
                                                    color="secondary"
                                                />
                                            // </ListItem>
                                        );
                                    })}
                                </Box>
                            </Box>
                            <Divider/>
                            {/*<Chip label="Chip Outlined" variant="outlined" color="success" />*/}
                            <Box my={2}>
                                <Typography variant="h4" component="div">
                                    Contacts
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Address
                                </Typography>
                                <Typography>
                                    {restaurant.address} {restaurant.postcode}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    Phone
                                </Typography>
                                <Typography>
                                    {restaurant.phone_number}
                                </Typography>
                            </Box>
                            <Divider/>
                            <Box
                                sx={{
                                    my: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h4" component="div">
                                    Menu
                                </Typography>
                                <Button variant="contained" onClick={() => {history(`/restaurant/${id}/menu`)}}>More</Button>
                            </Box>
                            <Divider/>
                            <Box
                                sx={{
                                    my: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h4" component="div">
                                    Vouchers
                                </Typography>
                                <Button variant="contained" onClick={() => {history(`/restaurant/${id}/voucher`)}}>More</Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            m: { xs: '5vw', sm: '2.5vw' },
                            width:  { xs: '90vw', sm: '95vw' },
                        }}
                    >
                        <Divider/>
                        <Typography my={2} variant="h4" component="div" gutterBottom>
                            Overview
                        </Typography>
                        <Typography
                            sx={{
                                mb: 5,
                                display: `${show ? 'inherit' : '-webkit-box'}`,
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 5,
                            }}
                        >
                            {restaurant.description}
                        </Typography>
                        <Divider/>
                        <Box
                            sx={{
                                mt: 2,
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    flexGrow: 1,
                                }}
                            >
                                <Typography variant="h4" component="div" gutterBottom >
                                    Comments
                                </Typography>
                                <FormControl sx={{width: 0.75}}>
                                    <InputLabel id="demo-simple-select-label">Order by</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={order}
                                        label="Order by"
                                        onChange={handleChangeOrder}
                                    >
                                        <MenuItem value={'time'}>Time</MenuItem>
                                        <MenuItem value={'-time'}>Reverse Time</MenuItem>
                                        <MenuItem value={'rating'}>Scoring</MenuItem>
                                        <MenuItem value={'-rating'}>Reverse Scoring</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Typography variant='h4' sx={{ color: 'primary.dark'}}>
                                    Total: {value}
                                </Typography>
                                <CommentRating size={'large'} value={value} precision={0.1} readOnly={true}/>
                            </Box>
                        </Box>
                        <br/>
                        <Divider/>
                        <Grid
                            container
                            spacing={2}
                        >
                            {comments.map((comment) => (
                                <Grid item xs={12} sm={12} md={12}>
                                    <Comment
                                        name={comment.name}
                                        description={comment.review}
                                        rate={comment.rate}
                                        date={comment.date}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        {/*<Link href="#" underline="hover" onClick={handleChangeShow}>*/}
                        {/*    {show ? 'Less' : 'More'}*/}
                        {/*</Link>*/}
                        <ButtomBox />
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
