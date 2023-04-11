import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import VoucherQRcode from "../Components/VoucherQRcode";

export default function CustomerVouchersDetailPage() {
    const history = useNavigate();
    const { id } = useParams();

    const [value, setValue] = React.useState({
        voucher_name: "Name",
        start_time: "2020.03.07",
        end_time: "2022.05.08",
        discount: "45",
        description: "description",
        code: "EF345FDS74AS",
        restaurant_name: '',
        address: '',
        postcode: '',
        phone_num: '',
    })

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {
        console.log({
            token: localStorage.getItem('token'),
            id: id,
        })
        axios.get(`http://127.0.0.1:8000/customer/voucher/details`, {
            params: {
                token: localStorage.getItem('token'),
                id: id,
            },})
            .then((response) => {
                console.log(response);
                setValue(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])


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
                <ButtonAppBar color="primary" />
                <Box
                    // position='fixed'
                    sx={{
                        mt: '10vh',
                        width: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        // variant="outlined"
                        sx={{
                            color: "#000",
                            width: { xs: '75%', sm: '50%' },
                        }}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: '#899668',
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-qrcode fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Voucher Detail'
                            subheader="Voucher detail for use"
                        />
                        <Divider/>
                        <CardContent>
                            <Card>
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
                                                {value.voucher_name}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {value.start_time} to {value.end_time}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                                            {value.discount}%
                                        </Typography>
                                    </Box>
                                    <Divider/>
                                    <Typography variant="h5" component="div" my={1} align='center'>
                                        {value.code}
                                    </Typography>
                                    <VoucherQRcode value={value.code}/>
                                    <Divider/>
                                    <Typography variant="body1" color="text.primary">
                                        {value.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </CardContent>
                        <Divider/>
                        <CardContent>
                            <Typography variant="h4" component="div">
                                {value.restaurant_name}
                            </Typography>
                            <Typography variant="h5" component="div">
                                Address
                            </Typography>
                            <Typography>
                                {value.address} {value.postcode}
                            </Typography>
                            <Typography variant="h5" component="div">
                                Phone
                            </Typography>
                            <Typography>
                                {value.phone_num}
                            </Typography>
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {history(-1)}}
                            >
                                Back
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
