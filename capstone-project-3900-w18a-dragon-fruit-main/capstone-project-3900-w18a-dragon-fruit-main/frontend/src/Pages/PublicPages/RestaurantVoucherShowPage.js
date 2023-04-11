import * as React from 'react';
import {
    Box,
    Button,
    CardContent,
    Divider, Grid,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import Card from "@mui/material/Card";
import ButtomBox from "../Components/ButtomBox";
import VoucherCard from "../Components/VoucherCard";
import SnackBar from "../Components/SnackBar";

function VoucherShowCard(props) {

    return (
        <Card
            sx={{
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
            <CardContent>
                <VoucherCard name={props.name} discount={props.discount} startTime={props.startTime} endTime={props.endTime} description={props.description}/>
                <br/>
                <Divider/>
                <br/>
                <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                    {props.availNumber}/{props.allNumber}
                </Typography>
                <Button variant="contained" onClick={() => {props.function(props.id)}} sx={{ width: 1}} >
                    Book
                </Button>
            </CardContent>
        </Card>
    );
}


export default function RestaurantVoucherShowPage() {
    const history = useNavigate();

    const [menus, setMenus] = React.useState([])

    const { id } = useParams();

    const [sign, setSign] = React.useState(false)

    const [snack, setSnack] = React.useState({
        message: "",
        open: false,
        severity: 'success',
    })

    const handleCloseSnack = () => {
        setSnack(prevState => ({
            ...prevState,
            open: false,
        }));
    }

    const handleOpenSnack = (message, severity) => {
        setSnack(prevState => ({
            open: true,
            message: message,
            severity: severity,
        }));
    }

    const bookRequest = async (id) => {

        const body = {
            token: localStorage.getItem('token'),
            voucher_id: id,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/customer/voucher/book', JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8;'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setSign(!sign)
                    handleOpenSnack("Voucher Booked", "success")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    }

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/vouchers/all`, {
            params: {
                id,
            },})
            .then((response) => {
                console.log(response);
                setMenus(response.data.vouchers)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sign])

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
                        // height: "100vh",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Typography variant='h1' align='center' sx={{ color: 'primary.dark'}} gutterBottom>
                        Voucher
                    </Typography>
                    <Box
                        sx={{
                            m: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}>
                        <Button variant="contained" onClick={() => {history(`/restaurant/${id}`)}} >
                            back
                        </Button>
                    </Box>
                    <Divider/>
                    <Grid
                        container
                        sx={{
                            mt: 1,
                            mx: '5vw',
                            width: "90vw"
                        }}
                        spacing={5}
                    >
                        {menus.map((menu) => (
                            <Grid item xs={12} sm={12} md={6}>
                                <VoucherShowCard
                                    // price={menu.price}
                                    name={menu.voucher_name}
                                    discount={menu.discount}
                                    startTime={menu.start_time}
                                    endTime={menu.end_time}
                                    description={menu.description}
                                    id={menu.voucher_id}
                                    allNumber={menu.all_number}
                                    availNumber={menu.available_number}
                                    function={bookRequest}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <ButtomBox />
                </Box>
                <SnackBar
                    function={handleCloseSnack}
                    open={snack.open}
                    message={snack.message}
                    severity={snack.severity}
                />
            </Box>
        </React.Fragment>
    );
}
