import * as React from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button,
    Divider,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SnackBar from "../Components/SnackBar";
import ProfileLeft from "../Components/ProfileLeft";
import RestaurantVoucherCard from "../Components/RestaurantVoucherCard"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinearChart from "../Components/LinearChart";
import ButtomBox from "../Components/ButtomBox";

export default function RestaurantVoucherPage() {
    const history = useNavigate();

    const [menus, setMenus] = React.useState([])

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

    const deleteRequest = async (id) => {

        const body = {
            token: localStorage.getItem('token'),
            dish_id: id,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/menu/delete_dish', JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8;'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setSign(!sign)
                    handleOpenSnack("Menu Deleted", "warning")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack("Error: Cannot Delete Menu", "error")
            });
    }


    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/vouchers/all`, {
            params: {
                id: localStorage.getItem('id'),
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
                            <Accordion my={3}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Chart</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LinearChart />
                                </AccordionDetails>
                            </Accordion>
                            <br/>
                            <Button variant="contained" onClick={() => {history('/restaurant/voucher/add')}} >
                                ADD
                            </Button>
                            <br/>
                            <Button variant="contained" onClick={() => {history('/restaurant/voucher/verify')}} color='secondary' >
                                Verify
                            </Button>
                            <br/>
                            <Divider/>
                            <Box>
                                {menus.map((menu) => (
                                        <RestaurantVoucherCard
                                            name={menu.voucher_name}
                                            discount={menu.discount}
                                            startTime={menu.start_time}
                                            endTime={menu.end_time}
                                            description={menu.description}
                                            id={menu.voucher_id}
                                            allNumber={menu.all_number}
                                            availNumber={menu.available_number}
                                            endReleaseTime={menu.end_release_time}
                                            startReleaseTime={menu.start_release_time}
                                        />
                                ))}
                            </Box>
                            <ButtomBox />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <SnackBar
                function={handleCloseSnack}
                open={snack.open}
                message={snack.message}
                severity={snack.severity}
            />
        </React.Fragment>
    );
}
