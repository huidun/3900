import * as React from "react";
import axios from "axios";
import {
    Box,
    Button,
    Dialog,
    Divider,
    Grid,
    Tab,
    Tabs,
    Typography,
    List,
    ListItem,
} from "@mui/material";
import TabPanel from "./TabPanel";
import {useNavigate, useParams} from "react-router-dom";
import CustomerVoucherCard from "./CustomerVoucherCard";
import DialogTitle from "@mui/material/DialogTitle";
import MessageFriendCard from "./MessageFriendCard";

export default function VouchersRight(props) {

    const history = useNavigate();

    const [vouchers, setVouchers] = React.useState({
        commented: [],
        expired: [],
        unused: [],
        used_uncommented: [],
    })

    const { id } = useParams();

    const handleChange = (event, newValue) => {
        // setValue(newValue);
        if (newValue === 'unused') {
            history('/customer/vouchers/unused')
        } else if (newValue === 'uncommented') {
            history('/customer/vouchers/uncommented')
        } else if (newValue === 'commented') {
            history('/customer/vouchers/commented')
        } else {
            history('/customer/vouchers/expired')
        }
    };

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/customer/vouchers/all`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setVouchers(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const [menus, setMenus] =React.useState( []);

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/message/voucher/friends`, {
            params: {
                token: localStorage.getItem('token'),
            },})
            .then((response) => {
                console.log(response);
                setMenus(response.data.friend_list)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [v_id, setV_id] = React.useState(-1);

    const handleSetV_id = (id) => {
        setV_id(id)
    }

    const ShareRequest = async (c_id) => {

        const body = {
            token: localStorage.getItem('token'),
            customer_id: c_id,
            v_id: v_id,
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/message/voucher/share', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    history(`/messages/${c_id}`)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <React.Fragment>
            <Box>
                <Tabs
                    value={id}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="wrapped label tabs example"
                >
                    <Tab value={'unused'} label="Unused" />
                    <Tab value={'uncommented'} label="Used Uncommented" />
                    <Tab value={'commented'} label="Commented" />
                    <Tab value={'expired'} label="Expired" />
                </Tabs>
            </Box>
            <Divider/>
            <TabPanel value={id} index={'unused'}>
                <Grid
                    container
                    spacing={3}
                >
                    {vouchers.unused.map((voucher) => (
                        <CustomerVoucherCard
                            restaurantName={voucher.restaurant_name}
                            name={voucher.voucher_name}
                            discount={voucher.discount}
                            startTime={voucher.start_time}
                            endTime={voucher.end_time}
                            description={voucher.description}
                            id={voucher.voucher_id}
                        >
                            <Button sx={{width: 1}} size="small" onClick={() => {history(`/customer/voucher/detail/${voucher.voucher_id}`)}}>Use</Button>
                            <Button sx={{width: 1}} size="small" onClick={() => {handleClickOpen(); handleSetV_id(voucher.voucher_id)}}>Share</Button>
                        </CustomerVoucherCard>
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={id} index={'uncommented'}>
                <Grid
                    container
                    spacing={3}
                >
                    {vouchers.used_uncommented.map((voucher) => (
                        <CustomerVoucherCard
                            restaurantName={voucher.restaurant_name}
                            name={voucher.voucher_name}
                            discount={voucher.discount}
                            startTime={voucher.start_time}
                            endTime={voucher.end_time}
                            description={voucher.description}
                            id={voucher.voucher_id}
                        >
                            <Button sx={{width: 1}} size="small" onClick={() => {history(`/customer/voucher/comment/${voucher.voucher_id}`)}}>Comment</Button>
                        </CustomerVoucherCard>
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={id} index={'commented'}>
                <Grid
                    container
                    spacing={3}
                >
                    {vouchers.commented.map((voucher) => (
                        <CustomerVoucherCard
                            restaurantName={voucher.restaurant_name}
                            name={voucher.voucher_name}
                            discount={voucher.discount}
                            startTime={voucher.start_time}
                            endTime={voucher.end_time}
                            description={voucher.description}
                            id={voucher.voucher_id}
                        />
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={id} index={'expired'}>
                <Grid
                    container
                    spacing={3}
                >
                    {vouchers.expired.map((voucher) => (
                        <CustomerVoucherCard
                            restaurantName={voucher.restaurant_name}
                            name={voucher.voucher_name}
                            discount={voucher.discount}
                            startTime={voucher.start_time}
                            endTime={voucher.end_time}
                            description={voucher.description}
                            id={voucher.voucher_id}
                        >
                            <Typography variant="body1"  color="text.secondary">
                                Cannot Used
                            </Typography>
                        </CustomerVoucherCard>
                    ))}
                </Grid>
            </TabPanel>
            <Dialog onClose={handleClose} open={open} fullWidth='sm' scroll={'paper'}>
                <DialogTitle>Select a friend you want to share the voucher</DialogTitle>
                <Divider/>
                <List sx={{ pt: 0, width: 1 }}>
                    {menus.map((menu) => (
                        <ListItem
                            key={menu.id}
                            sx={{width: 1}}
                            // onClick={() => ShareRequest(menu.id)}
                        >
                            <MessageFriendCard
                                name={menu.name}
                                email={menu.email}
                                id={menu.id}
                                unread={0}
                                function={() => {ShareRequest(menu.id)}}
                            />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </React.Fragment>
    );
}