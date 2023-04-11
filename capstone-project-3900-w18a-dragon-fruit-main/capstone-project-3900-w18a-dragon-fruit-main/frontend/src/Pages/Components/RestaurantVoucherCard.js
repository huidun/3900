import Card from "@mui/material/Card";
import {Box, Button, CardActions, CardContent, Divider, Typography} from "@mui/material";
import * as React from "react";
import VoucherCard from "./VoucherCard";
import {useNavigate} from "react-router-dom";

export default function RestaurantVoucherCard(props) {

    const history = useNavigate();

    return (
        <Card
            sx={{
                my: 3,
                width: 1,
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
            <CardContent>
                <VoucherCard
                    name={props.name}
                    discount={props.discount}
                    startTime={props.startTime}
                    endTime={props.endTime}
                    description={props.description}
                />
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'row',*/}
                {/*        justifyContent: 'space-between',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Typography variant="h5" component="div" >*/}
                {/*        {props.name}*/}
                {/*    </Typography>*/}
                {/*    <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>*/}
                {/*        {props.price}%*/}
                {/*    </Typography>*/}
                {/*</Box>*/}
                {/*<Typography variant="body1" color="text.secondary">*/}
                {/*    {props.description}*/}
                {/*</Typography>*/}
            </CardContent>
            <Divider/>
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
                        <Typography variant="body1"  color="text.primary" >
                            From: {props.startReleaseTime}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            To:  {props.endReleaseTime}
                        </Typography>
                    </Box>
                    <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                        {props.availNumber}/{props.allNumber}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Button size="small" onClick={() => {history(`/restaurant/voucher/${props.id}/change`)}}>Change</Button>
                {/*<Button size="small" onClick={() => {props.function(props.id)}}>Delete</Button>*/}
            </CardActions>
        </Card>
    );
}