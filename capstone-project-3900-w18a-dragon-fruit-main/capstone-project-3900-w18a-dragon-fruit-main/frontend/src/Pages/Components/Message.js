import Card from "@mui/material/Card";
import {Box, Typography} from "@mui/material";
import AvatatName from "./AvatatName";
import * as React from "react";

export default function Message(props) {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: props.mine ? 'row-reverse' : 'row',
                justifyContent: 'flex-start',
                flexGrow: 1,
            }}
        >
            <AvatatName name={props.name} size={56}/>
            <Box
                sx={{
                    mx: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: props.mine ? 'flex-end' : 'flex-start',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{ fontFamily: 'Georgia'}}
                        align={props.mine ? 'right' : 'left'}
                    >
                        {props.name}&nbsp;
                    </Typography>
                    <Card
                        sx={{
                            bgcolor: props.mine ? "secondary.light" : "default",
                        }}
                    >
                        <Typography m={1.5} variant="body1" color="text.secondary">
                            {props.description}
                        </Typography>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}