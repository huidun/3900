import {Box, CardActionArea, CardContent, Typography} from "@mui/material";
import AvatatName from "./AvatatName";
import * as React from "react";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import MessageNum from "./MessageNum";
import {useNavigate} from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -30,
        top: 30,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export default function MessageFriendCard(props) {
    const history = useNavigate();
    return (
        <Box
            sx={{
                width: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                bgcolor: props.selected ? 'background.default' : 'default',
                // default: '#f8f4ed',
                // paper: '#fafafa',
                // '&:hover': {
                //     boxShadow: 5,
                // },
            }}
        >
            <CardActionArea onClick={() => {props.function();}}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flexGrow: 1,
                    }}
                >
                    <AvatatName name={props.name} size={56}/>
                    <Box width='5%'/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            flexGrow: 1,
                        }}
                    >
                        <Typography variant="h5" component="div" sx={{ fontFamily: 'Georgia'}}>
                            {props.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {props.email}
                        </Typography>
                    </Box>
                    <MessageNum num={props.unread} maxNum={99}/>
                </CardContent>
            </CardActionArea>
        </Box>
    );
}