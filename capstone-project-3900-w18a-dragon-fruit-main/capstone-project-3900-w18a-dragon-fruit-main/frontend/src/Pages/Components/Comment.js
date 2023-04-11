import Card from "@mui/material/Card";
import {Box, CardContent, Divider, Typography} from "@mui/material";
import AvatatName from "./AvatatName";
import * as React from "react";
import CommentRating from "./CommentRating";

export default function Comment(props) {

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
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        my: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        flexGrow: 1,
                    }}
                >
                    <AvatatName name={props.name} size={56}/>
                    <Box
                        sx={{
                            mx: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography variant="h5" component="div" sx={{ fontFamily: 'Georgia'}}>
                            {props.name}&nbsp;
                            <Typography variant="body1" component="span" color='secondary'>
                                {props.date}
                            </Typography>
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <CommentRating value={props.rate} precision={0.1} readOnly/>
                            <Typography mx={1} variant="body1" color="text.secondary">
                                {props.rate}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider/>
                <Typography p={1} variant="body1" color="text.secondary">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}