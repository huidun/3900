import * as React from 'react';
import {
    Box,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import ProfileLeft from "../Components/ProfileLeft";
import ButtomBox from "../Components/ButtomBox";
import VouchersRight from "../Components/VouchersRight";

export default function CustomerVouchersPage() {
    const history = useNavigate();

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: 1,
                    height: "100vh",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}
            >
                <ButtonAppBar color="primary"/>
                <Box
                    // position='fixed'
                    sx={{
                        mt: '10vh',
                        width: 1,
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography variant='h1' align='center' sx={{ color: 'primary.dark'}} gutterBottom>
                        Vouchers
                    </Typography>
                    <Box
                        sx={{
                            width: 1,
                            // height: "100vh",
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'center',
                        }}
                    >
                        <ProfileLeft select={'Vouchers'}/>
                        <Divider orientation="vertical" flexItem />
                        <Divider />
                        <Box
                            sx={{
                                px: '3%',
                                // width: { xs: '100%', sm: '70%' },
                                flexGrow: 1,
                                // height: "100vh",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <VouchersRight />
                            <ButtomBox/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
