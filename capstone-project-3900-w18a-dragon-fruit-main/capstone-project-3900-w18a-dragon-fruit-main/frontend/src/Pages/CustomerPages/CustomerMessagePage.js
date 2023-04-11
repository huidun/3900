import * as React from 'react';
import {
    Box,
    Divider, Grid,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import SnackBar from "../Components/SnackBar";
import ProfileLeft from "../Components/ProfileLeft";
import MessageFriendCard from "../Components/MessageFriendCard";
import MessageMiddle from "../Components/MessageMiddle";

// import * as PropTypes from "prop-types";


export default function CustomerMessagePage() {
    const history = useNavigate();

    const { id } = useParams();

    const [sign, setSign] = React.useState(false)

    const ClickFriend = (id) => {
        history(`/messages/${id}`);
        setSign(!sign)
    }


    const [following, setFollowing] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/message/channels`, {
            params: {
                customer_id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setFollowing(response.data.channels)
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
                    position='fixed'
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
                        Messages
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
                        <ProfileLeft select={'Messages'}/>
                        <Divider orientation="vertical" flexItem />
                        <Divider />
                        <Box
                            sx={{
                                // px: '3%',
                                // width: { xs: '100%', sm: '70%' },
                                flexGrow: 1,
                                // height: "100vh",
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <MessageMiddle sign={sign} function={ClickFriend}/>
                            <Divider orientation="vertical" flexItem />
                            <Box
                                sx={{
                                    // px: '1%',
                                    width: { xs: '100%', sm: '40%' },
                                    // flexGrow: 1,
                                    // height: "100vh",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Grid
                                    container
                                    spacing={0}
                                >
                                    {following.map((menu) => (
                                        <Grid item xs={12} sm={12} md={12}>
                                            {/*<Divider/>*/}
                                            <MessageFriendCard
                                                name={menu.customer_name}
                                                email={menu.customer_email}
                                                id={menu.customer_id}
                                                selected={`${id}` === `${menu.id}`}
                                                unread={menu.total_unread}
                                                function={() => {ClickFriend(menu.customer_id)}}
                                                // follow={'unfollow'}
                                            />
                                            {/*<Divider/>*/}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
