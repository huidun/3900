import * as React from "react";
import {QRCodeSVG} from 'qrcode.react';
import {Box} from "@mui/material";

export default function VoucherQRcode(props) {

    return (
        <Box
            sx={{
                m: 1,
                mb: 3,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <QRCodeSVG
                id="qrCode"
                value={props.value}
                size={300}
                fgColor={"#8e2525"}
                bgColor={"#fafafa"}
            />
        </Box>
    );
}