import * as React from 'react';
import {
    Box,
    Button,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SnackBar from "../Components/SnackBar";
import ProfileLeft from "../Components/ProfileLeft";
import ButtomBox from "../Components/ButtomBox";
import FriendRight from "../Components/FriendRight";


export default function CustomerFriendsPage() {
    const history = useNavigate();

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

    const [sign, setSign] = React.useState(false)

    const deleteRequest = async (id, type) => {

        const body = {
            token: localStorage.getItem('token'),
            customer_id: id,
            type: type,
        }
        console.log(body)


        await axios.put('http://127.0.0.1:8000/customer/friend/follow_unfollow', JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8;'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setSign(!sign)
                    // handleOpenSnack("Friend Deleted", "warning")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack("Error: Cannot Delete Menu", "error")
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
                        Friends
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
                        <ProfileLeft select={'Friends'}/>
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
                            <Button my={3} variant="contained" onClick={() => {history('/friend/add')}} >
                                ADD Friend
                            </Button>
                            <br />
                            <FriendRight sign={sign} deleteRequest={deleteRequest} />
                            <ButtomBox/>
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
