import * as React from 'react';
import {
    Box,
    Divider, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Typography,
} from "@mui/material";

import {
    mdiAccount,
    mdiAccountMultiple,
    mdiSilverwareForkKnife,
    mdiFood,
    mdiTicketPercent,
    mdiMessageStar,
    mdiMessageText,
    mdiImageMultiple,
} from '@mdi/js';
import Icon from "@mdi/react";
import { useNavigate } from 'react-router-dom';

function ProfileItem(props) {
    const color = props.select ? { color: 'primary.main' } : null

    return (
        <React.Fragment>
            <ListItem sx={props.sx}>
                <ListItemButton sx={color} onClick={props.onClick}>
                    <ListItemIcon sx={color}>
                        <Icon path={props.path}
                              size={1.25}
                              horizontal
                              vertical
                              rotate={180}
                        />
                    </ListItemIcon>
                    <ListItemText primary={props.text} />
                    <Typography fontFamily={'Leaves'}>{props.select ? props.text[0] : ' '}</Typography>
                    {/*<Icon path={mdiCardsDiamond} size={0.5} horizontal vertical />*/}
                </ListItemButton>
            </ListItem>
            <Divider sx={props.sx}/>
        </React.Fragment>
    )
}


export default function ProfileLeft(props) {

    const history = useNavigate();

    return (
        <Box
            sx={{
                px: '3%',
                minWidth: { xs: '90%', sm: '25%' },
                // flexGrow: 1,
                // height: "100vh",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
        >
            <ProfileItem
                path={mdiAccount}
                text={'Profile'}
                select={props.select === 'Profile'}
                onClick={() => {history('/profile')}}
            />
            <ProfileItem
                path={mdiSilverwareForkKnife}
                text={'Restaurant'}
                select={props.select === 'Restaurant'}
                onClick={() => {history('/restaurant/profile')}}
                sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiTicketPercent}
                text={'Vouchers'}
                select={props.select === 'Vouchers'}
                onClick={() => {history('/restaurant/voucher')}}
                sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiFood}
                text={'Menu'}
                select={props.select === 'Menu'}
                onClick={() => {history('/restaurant/menu')}}
                sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiMessageStar}
                text={'Comments'}
                select={props.select === 'Comments'}
                onClick={() => {history('/restaurant/comments')}}
                sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiImageMultiple}
                text={'Images'}
                select={props.select === 'Images'}
                onClick={() => {history('/restaurant/photo')}}
                sx={{ display: localStorage.getItem('type') === 'restaurant' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiAccountMultiple}
                text={'Friends'}
                select={props.select === 'Friends'}
                onClick={() => {history('/friends/followers')}}
                sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiTicketPercent}
                text={'Vouchers'}
                select={props.select === 'Vouchers'}
                onClick={() => {history('/customer/vouchers/unused')}}
                sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}
            />
            <ProfileItem
                path={mdiMessageText}
                text={'Messages'}
                select={props.select === 'Messages'}
                onClick={() => {history('/messages/all')}}
                sx={{ display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none' }}
            />
        </Box>
    );
}
