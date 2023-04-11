import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Badge from '@mui/material/Badge';
import Icon from '@mdi/react'
import {
    mdiAccountMultiple,
    mdiFood,
    mdiImageMultiple,
    mdiMessageStar,
    mdiMessageText,
    mdiTicketPercent,
    mdiSilverwareForkKnife,
    mdiAccount,
    mdiLogoutVariant,
    mdiLoginVariant,
    mdiAccountPlus
} from '@mdi/js';

import logo from "../Image/logo.png";
import {Fab, Typography} from "@mui/material";
import axios from "axios";
import AvatatName from "./AvatatName";

export default function ButtonAppBar(props) {

    const history = useNavigate();

    const [user, setUser] = React.useState({
        name: "",
        id: 0,
        messageNum: 1,
        voucherNum: 100,
    });


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        console.log(localStorage.getItem('token'))
        axios.get(`http://127.0.0.1:8000/getinfo`, {
            params: {
                token: localStorage.getItem('token'),
            },} ).then((response) => {
                console.log(response);
                setUser(prevState => ({
                    name: response.data.name,
                    id: response.data.id,
                    messageNum: response.data.unread_message,
                    voucherNum: response.data.unused_voucher,
                }));
            })
            .catch((error) => {
                console.log(error);
                setUser(prevState => ({
                    ...prevState,
                    name: "",
                    id: 0,
                }));
            });
    }, [localStorage.getItem('token')])

    const SignuotRequest = async () => {

        const body = {
            token: localStorage.getItem('token')
        }

        await axios.post('http://127.0.0.1:8000/auth/logout', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('id')
                    localStorage.removeItem('type')
                    history('/')
                    // console.log(response);
                }
            })
            .catch((error) => {
                console.log(error)
                localStorage.removeItem('token')
                localStorage.removeItem('id')
                localStorage.removeItem('type')
                history('/')
                // setToken('');
            });
    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                // color="transparent"
                color={props.color}
            >
                <Toolbar>
                    <Avatar alt="binge_logo" src={logo} onClick={() => {handleClose(); history('/')}} sx={{'&:hover': {boxShadow: 5,},}}/>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="h3"
                            // color='#000'
                            sx={{
                                fontFamily: 'Raghate, Party LET,Brush Script MT',
                                '&:hover': {
                                    color: 'secondary.main'
                                },
                            }}
                            align='center'
                            onClick={() => {handleClose(); history('/restaurants/search')}}
                        >
                            Binge
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClick} >
                        <AvatatName name={user.name} />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => { handleClose(); history('/profile')}} sx={{ display: user.id !== 0 ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiAccount}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Profile
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/restaurant/profile')}} sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiSilverwareForkKnife}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Restaurant
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/restaurant/voucher')}} sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiTicketPercent}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Vouchers
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/restaurant/menu')}} sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiFood}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Menu
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/restaurant/comments')}} sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiMessageStar}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Comments
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/restaurant/photo')}} sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiImageMultiple}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Images
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/friends/followers')}} sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiAccountMultiple}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Friends
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/customer/vouchers/unused')}} sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiTicketPercent}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Vouchers
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose();history('/messages/all')}} sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiMessageText}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Messages
                            </ListItemText>
                        </MenuItem>
                        <Divider sx={{ display: user.id !== 0 ? 'flex' : 'none' }} />
                        <MenuItem onClick={() => {SignuotRequest();handleClose();}} sx={{ display: user.id !== 0 ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon path={mdiLogoutVariant}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                            </ListItemIcon>
                            <ListItemText>
                                Sign out
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose(); history('/login')}} sx={{ display: user.id !== 0 ? 'none' : 'flex' }}>
                            <ListItemIcon>
                                <Icon path={mdiLoginVariant}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                                {/*<Box className="fa-solid fa-arrow-right-to-bracket fa-lg"/>*/}
                            </ListItemIcon>
                            <ListItemText>
                                Sign in
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose(); history('/signup')}} sx={{ display: user.id !== 0 ? 'none' : 'flex' }}>
                            <ListItemIcon>
                                {/*<Box color='primary.main'>*/}
                                    <Icon path={mdiAccountPlus}
                                          title="message"
                                          size={1}
                                          horizontal
                                          vertical
                                          rotate={180}
                                        // spin
                                    />
                                {/*</Box>*/}
                                {/*<Box className="fa-solid fa-user-plus fa-lg"/>*/}
                            </ListItemIcon>
                            <ListItemText>
                                Sign up
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                position='fixed'
                sx={{
                    // mt: '100vh',
                    // mx: '90vw',
                    // width: "100vw",
                    height: "100vh",
                    display: localStorage.getItem('type') !== 'customer' ? 'none' : 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                <Box
                    // position='fixed'
                    sx={{
                        // width: "100vw",
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                    <Fab color="primary" aria-label="add" onClick={() => {history('/customer/vouchers/unused')}} sx={{m: 2,}}>
                        <Badge color="secondary" badgeContent={user.voucherNum}>
                            <Avatar
                                sx={{
                                    '&:hover': {
                                        opacity: 0.7,
                                    },
                                }}
                            >
                                <Icon path={mdiTicketPercent}
                                      title="voucher"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // color="primary.main"
                                    // spin
                                />
                                {/*<Box sx={{ color: '#fff' }} className="fa-solid fa-money-bill fa-lg"/>*/}
                            </Avatar>
                        </Badge>
                    </Fab>
                    <Fab color="primary" aria-label="add" onClick={() => {history('/messages/all')}} sx={{m: 2,}}>
                        <Badge color="secondary" badgeContent={user.messageNum}>
                            <Avatar
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        opacity: 0.7,
                                    },
                                }}
                            >
                                <Icon path={mdiMessageText}
                                      title="message"
                                      size={1}
                                      horizontal
                                      vertical
                                      rotate={180}
                                    // spin
                                />
                                {/*<Box sx={{ color: '#fff' }} className="fa-solid fa-comment-dots fa-lg"/>*/}
                            </Avatar>
                        </Badge>
                    </Fab>
                </Box>
            </Box>
        </Box>
    );
}
