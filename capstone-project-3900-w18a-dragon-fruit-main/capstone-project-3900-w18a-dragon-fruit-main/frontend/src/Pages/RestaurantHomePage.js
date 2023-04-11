import * as React from 'react';
import {
    Box, Button, Chip,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from './Components/LoadingHeader';

import {useNavigate} from 'react-router-dom';
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";


export default function RestaurantHomePage() {
    const history = useNavigate();
    // const id = props.match.params.id;
    // const { id } = useParams();

    const [show, setShow] = React.useState(false)

    // const handleChangeShow = () => {
    //     setShow(!show)
    // }


    const [restaurant, setRestaurant] = React.useState(
        {
            name: '',
            email: '',
            address: '',
            postcode: '',
            phone_number: '',
            description: '',
        }
    )

    const [cuisines, setCuisines] = React.useState([]);

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/profile/details`, {
            params: {
                id: localStorage.getItem('id'),
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
                }));
                setCuisines(response.data.cuisine)
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
                                    image="https://d3aux7tjp119y2.cloudfront.net/original_images/Tak2-CMSTemplate_IrMZHla.jpg"
                                    alt={restaurant.name}
                                />
                            </Box>
                            <Button variant="contained" my={2} >More</Button>
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h4" component="div">
                                        Cuisines
                                    </Typography>
                                    <Button variant="contained" onClick={() => {history('/restaurant/edit/cuisines')}}>edit</Button>
                                </Box>
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                <Typography variant="h4" component="div" >
                                    Contacts
                                </Typography>
                                <Button variant="contained" onClick={()=>{history('/restaurant/edit/context')}}>edit</Button>
                                </Box>
                                <Typography variant="h5" component="div">
                                    Restaurant Name
                                </Typography>
                                <Typography>
                                    {restaurant.name}
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
                                <Button variant="contained" onClick={() => {history('/restaurant/menu')}}>More</Button>
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
                                <Button variant="contained">More</Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            m: { xs: '5vw', sm: '2.5vw' },
                            width:  { xs: '90vw', sm: '95vw' },
                        }}
                    >
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h4" component="div">
                                Overview
                            </Typography >
                            <Button variant="contained" onClick={()=>{history('/restaurant/edit/overview')}}>edit</Button>
                        </Box>
                        <Typography
                            sx={{
                                display: `${show ? 'inherit' : '-webkit-box'}`,
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 5,
                            }}
                        >
                            {restaurant.description}
                        </Typography>
                        {/*<Link href="#" underline="hover" onClick={handleChangeShow}>*/}
                        {/*    {show ? 'Less' : 'More'}*/}
                        {/*</Link>*/}
                    </Box>
                    <Box height='30vh'/>
                </Box>
            </Box>
        </React.Fragment>
    );
}
