import {Box, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import * as React from "react";

export default function MessageNum(props) {
    return (
        <Box
            sx={{
                display: props.num !== 0 ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Avatar
                sx={{
                    width: 25,
                    height: 25,
                    bgcolor: '#899668',
                }}
            >
                <Typography variant='body2'>
                    {props.num > props.maxNum ? '99+' : props.num}
                </Typography>
            </Avatar>
        </Box>
    );
}