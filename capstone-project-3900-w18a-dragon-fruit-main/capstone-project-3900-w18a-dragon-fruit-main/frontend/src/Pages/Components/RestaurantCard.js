import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {IconButton} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useNavigate} from "react-router-dom";
import CommentRating from "./CommentRating";
import axios from "axios";
import SnackBar from "./SnackBar";

export default function RestaurantCard(props) {
    const history = useNavigate();

    const LikeRequest = async () => {

        const body = {
            token: localStorage.getItem('token'),
            r_id: props.id,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/subscription/subscribe', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    // props.functionget();
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    }

    const DislikeRequest = async () => {

        const body = {
            token: localStorage.getItem('token'),
            r_id: props.id,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/subscription/unsubscribe', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    // props.functionget();
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

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

    return (
        <Card
            sx={{
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
            <CardMedia
                component="img"
                alt="green iguana"
                height="200"
                image={props.image}
            />
            <CardContent>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'Georgia', }} >
                    {props.name}
                </Typography>
                <CommentRating value={props.rate} precision={0.1} readOnly mb={1}/>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 5,
                    }}
                >
                    {props.overview}
                </Typography>
            </CardContent>
            <CardActions
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                }}
            >
                <IconButton onClick={() => {props.like ? DislikeRequest() : LikeRequest(); props.functionget()}}>
                    {props.like ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
                </IconButton>
                <Button size="small" onClick={() => {history(`/restaurant/${props.id}`)}}>Learn More</Button>
            </CardActions>
            <SnackBar
                function={handleCloseSnack}
                open={snack.open}
                message={snack.message}
                severity={snack.severity}
            />
        </Card>
    );
}
