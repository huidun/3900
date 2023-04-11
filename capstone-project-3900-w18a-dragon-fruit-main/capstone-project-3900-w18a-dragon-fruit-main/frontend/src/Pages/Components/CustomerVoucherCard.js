import {Card, CardContent, CardHeader, Divider} from "@mui/material";
import * as React from "react";
import VoucherCard from "./VoucherCard";

export default function CustomerVoucherCard(props) {

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
            <CardHeader
                title={props.restaurantName}
            />
            <Divider/>
            <CardContent>
                <VoucherCard
                    name={props.name}
                    discount={props.discount}
                    startTime={props.startTime}
                    endTime={props.endTime}
                    description={props.description}
                />
            </CardContent>
            <Divider/>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
}