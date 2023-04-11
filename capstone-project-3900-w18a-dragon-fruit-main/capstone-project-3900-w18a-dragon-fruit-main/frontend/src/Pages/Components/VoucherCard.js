import Card from "@mui/material/Card";
import {Box, CardContent, Divider, Typography} from "@mui/material";
import * as React from "react";

export default function VoucherCard(props) {

    return (
        <Card
            sx={{
                width: 1,
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography variant="h5" component="div" >
                            {props.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {props.startTime} to {props.endTime}
                        </Typography>
                    </Box>
                    <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                        {props.discount}%
                    </Typography>
                </Box>
                <Divider/>
                <Typography variant="body1" color="text.primary">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}