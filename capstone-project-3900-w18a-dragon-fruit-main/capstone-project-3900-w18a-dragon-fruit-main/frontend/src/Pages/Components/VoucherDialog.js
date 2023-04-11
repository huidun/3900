import * as React from 'react';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import {Box, Divider} from "@mui/material";

export default function VoucherDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} open={open} >
            <DialogTitle
            >
                Voucher Information
                <Divider/>
            </DialogTitle>
            <Divider/>
            <Box
                sx={{
                    width: '25vw',
                    mt: 1,
                    mx: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h4" component="div" >
                    {props.selectedValue.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                    {props.selectedValue.discount}%
                </Typography>
            </Box>
            <Divider/>
            <br/>
            <Typography variant="body1" color="text.primary">
                {props.selectedValue.description}
            </Typography>
        </Dialog>
    );
}