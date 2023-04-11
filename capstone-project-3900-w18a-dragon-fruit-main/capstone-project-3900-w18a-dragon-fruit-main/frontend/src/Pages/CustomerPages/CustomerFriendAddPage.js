import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider, Grid, IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";

import StoreToken from '../../Util/Store';
import SearchIcon from "@mui/icons-material/Search";
import FriendCard from "../Components/FriendCard";

export default function CustomerFriendAddPage() {
    const history = useNavigate();

    const [value, setValue] = React.useState("")

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const [sign, setSign] = React.useState(false)

    const [menus, setMenus] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/search/friend`, {
            params: {
                token: localStorage.getItem('token'),
                id: localStorage.getItem('id'),
                search_word: value,
            },})
            .then((response) => {
                console.log(response);
                setMenus(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sign])

    const FollowRequest = async (id, type) => {
        const body = {
            token: localStorage.getItem('token'),
            customer_id: id,
            type: type,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/customer/friend/follow_unfollow', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setSign(!sign)
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-user-plus fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Add Friend'
                            subheader="Search Name and Add"
                        />
                        <Divider/>
                        <CardContent>
                            <Box
                                my={4}
                            >
                                <TextField
                                    color="secondary"
                                    sx={{
                                        width: 1,
                                        // mb: 4,
                                    }}
                                    type='search'
                                    id="search"
                                    label="search"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment>
                                                <IconButton>
                                                    <SearchIcon
                                                        onClick={() => {setSign(!sign)}}
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    value={value}
                                    name='search'
                                    onChange={handleChange}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            setSign(!sign)
                                        }
                                    }}
                                />
                            </Box>
                            <Typography>Unfollowed User:</Typography>
                            <Divider />
                            <Box
                                sx={{
                                    height: '30vh',
                                    overflow: "hidden",
                                    overflowY: "scroll",
                                    px: 1,
                                }}
                            >
                                {menus.map((menu) => (
                                    <Grid my={2}>
                                        <FriendCard
                                            name={menu.name}
                                            email={menu.email}
                                            id={menu.id}
                                            function={FollowRequest}
                                            follow={'follow'}
                                        />
                                    </Grid>
                                ))}
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
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {history(-1)}}
                            >
                                Back
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
