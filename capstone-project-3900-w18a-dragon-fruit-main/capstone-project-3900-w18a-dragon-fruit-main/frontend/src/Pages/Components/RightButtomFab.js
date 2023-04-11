import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Icon from '@mdi/react'
import { mdiMessageText} from '@mdi/js';
import { mdiTicketPercent } from '@mdi/js';

import {Fab} from "@mui/material";

export default function ButtonAppBar(props) {

    const history = useNavigate();

    const [user, setUser] = React.useState({
        name: "",
        id: 0,
        messageNum: 1,
        voucherNum: 100,
    });

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box
                position='fixed'
                sx={{
                    // mt: '100vh',
                    // mx: '90vw',
                    // width: "100vw",
                    height: "100vh",
                    display: localStorage.getItem('type') === 'customer' ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                <Box
                    // position='fixed'
                    sx={{
                        width: "100vw",
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                    <Fab color="primary" aria-label="add" onClick={() => {history('/customer/voucher')}} sx={{m: 2,}}>
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
                    <Fab color="primary" aria-label="add" sx={{m: 2,}}>
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
