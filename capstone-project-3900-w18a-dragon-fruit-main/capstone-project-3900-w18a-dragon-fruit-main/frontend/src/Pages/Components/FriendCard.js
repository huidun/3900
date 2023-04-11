import {Card, Box, Button, CardContent, Typography} from "@mui/material";
import AvatatName from "./AvatatName";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export default function FriendCard(props) {

    const history = useNavigate();

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
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
            </CardContent>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    width: '20%',
                    pr: 1,
                }}
            >
                <Button fullWidth variant="outlined" size="small" onClick={() => {props.function(props.id, props.follow)}}>{props.follow}</Button>
                <Button fullWidth variant="outlined" size="small" onClick={() => {history(`/messages/${props.id}`)}}>Message</Button>
            </Box>
        </Card>
    );
}