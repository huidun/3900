import * as React from 'react';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import {Link} from "@mui/material";

export default function SignupSelectPage() {
    const history = useNavigate();

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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-user-plus fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Sign up'
                            subheader="sign up here with email"
                        />
                        <Divider/>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-around',
                            }}
                        >
                            <Box
                                sx={{
                                    width:  { xs: '100%', sm: '50%' },
                                    mx: { xs: 0, sm: 4 },
                                    my: 4,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        p: 8,
                                        width: 1,
                                    }}
                                    onClick={() => {history('/signup/customer')}}
                                >
                                    <Typography gutterBottom variant="h5" align='center'>
                                        Customer
                                    </Typography>
                                </Button>

                            </Box>
                            <Box
                                sx={{
                                    width:  { xs: '100%', sm: '50%' },
                                    mx: { xs: 0, sm: 4 },
                                    my: 4,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        p: 8,
                                        width: 1,
                                    }}
                                    onClick={() => {history('/signup/restaurant')}}
                                >
                                    <Typography gutterBottom variant="h5" align='center'>
                                        Restaurant
                                    </Typography>
                                </Button>

                            </Box>
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography align='right' sx={{ width: '100%', }} onClick={() => {history('/login')}}>
                                <Link href="#" underline="hover">
                                    Already have an account? Log in
                                </Link>
                            </Typography>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
