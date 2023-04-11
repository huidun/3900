import * as React from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    InputAdornment,
    TextField,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import StoreToken from '../../Util/Store';
import Card from "@mui/material/Card";
import {MobileDateTimePicker} from "@mui/x-date-pickers";

function DateParse(date_string) {
    const new_string = date_string.split(' ');
    const new_date = new_string[0].split('-');
    const new_time = new_string[1].split(':');
    return new Date(new_date[0], new_date[1], new_date[2], new_time[0], new_time[1], new_time[2])
}

export default function RestaurantVoucherChangePage() {

    const history = useNavigate();
    const [, setToken] = StoreToken();

    const { id } = useParams();

    const [user, setUser] = React.useState({
        name: "",
        startTime: new Date(),
        endTime: new Date(new Date().getTime()+(24*60*60*1000)),
        percent: "",
        description: "",
    });

    const handleChangeStartTime = (newDate) => {
        setUser(prevState => ({
            ...prevState,
            startTime: newDate,
            endTime: new Date(newDate.getTime()+(24*60*60*1000)),
        }));
    }

    const handleChangeEndTime = (newDate) => {
        setUser(prevState => ({
            ...prevState,
            endTime: newDate
        }));
    }

    const [error, setError] = React.useState({
        nameError: false,
        nameMessage: " ",
        priceError: false,
        priceMessage: " ",
    });

    const [value, setValue] = React.useState({
        startTime: new Date(new Date().getTime()-(24*60*60*1000)),
        endTime: new Date(new Date().getTime()-(22*60*60*1000)),
        totalNum: 1,
    });

    const handleChangeValueStartTime = (newDate) => {
        setValue(prevState => ({
            ...prevState,
            startTime: newDate,
            endTime: new Date(newDate.getTime()+(2*60*60*1000)),
        }));
    }

    const handleChangeValueEndTime = (newDate) => {
        setValue(prevState => ({
            ...prevState,
            endTime: newDate
        }));
    }

    const handleChange = (event) => {
        setUser(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleChangeValue = (event) => {
        setValue(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const [isCustomer, setIsCustomer] = React.useState(true);

    const handleChangeIsCustomer = () => {
        setIsCustomer(!isCustomer);
    };

    const SubmitRequest = async () => {

        // data['token'], data['dish_name'], data['price'],  data['description']
        const body = {
            token: localStorage.getItem('token'),
            voucher: {
                voucher_id: id,
                voucher_name: user.name,
                start_time: user.startTime.toISOString(),
                end_time: user.endTime.toISOString(),
                discount: user.percent,
                description: user.description,
            },
            total_number: value.totalNum,
            start_release_time: value.startTime.toISOString(),
            end_release_time: value.endTime.toISOString(),
        }
        console.log(body)

        await axios.put('http://127.0.0.1:8000/restaurant/voucher/edit', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    history('/restaurant/voucher')
                }
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    setError(prevState => ({
                        priceError: true,
                        priceMessage: error.response.data.description,
                        nameError: false,
                        nameMessage: " ",
                    }));
                } else if (error.response.status === 400) {
                    setError(prevState => ({
                        nameError: true,
                        nameMessage: error.response.data.description,
                        priceError: false,
                        priceMessage: " ",
                    }));
                }
            });
    }

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/voucher/details`, {
            params: {
                id,
            },})
            .then((response) => {
                console.log(response);
                setUser({
                    name: response.data.voucher_name,
                    startTime: DateParse(response.data.start_time),
                    endTime: DateParse(response.data.end_time),
                    percent: response.data.discount,
                    description: response.data.description,
                })
                setValue({
                    startTime: DateParse(response.data.start_release_time),
                    endTime: DateParse(response.data.end_release_time),
                    totalNum: response.data.all_number,
                })
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
                    justifyContent: 'center',
                }}
            >
                <ButtonAppBar color="primary" />
                <Box
                    // position='fixed'
                    sx={{
                        width: 1,
                        // height: "100vh",
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
                            // backgroundImage: 'linear-gradient(to right bottom, #ee3f4d, #5dbe8a)',
                            // width: 1,
                            // height: "75%",
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
                                <Box sx={{ color: '#fff' }} className="fa-solid fa-money-bill-wave fa-lg"/>
                            </Avatar>
                        </CardContent>
                        <CardHeader
                            title='Change Voucher'
                            subheader="change Voucher here"
                        />
                        <Divider/>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    pr: 2,
                                }}
                            >
                                <Card>
                                    <CardContent>
                                        <Box
                                            my={2}
                                        >
                                            <TextField
                                                color="secondary"
                                                sx={{
                                                    width: '100%',
                                                }}
                                                type='text'
                                                id="input_name"
                                                label="Name"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box className="fa-solid fa-utensils fa-lg"/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                value={user.name}
                                                name='name'
                                                onChange={handleChange}
                                                error={error.nameError}
                                                helperText={error.nameMessage}
                                            />
                                        </Box>
                                        <Box
                                            my={2}
                                        >
                                            <TextField
                                                color="secondary"
                                                sx={{
                                                    width: '100%',
                                                }}
                                                type='number'
                                                id="input_percent"
                                                label="Percent"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box className="fa-solid fa-percent fa-lg"/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                value={user.percent}
                                                name='percent'
                                                onChange={handleChange}
                                                error={error.priceError}
                                                helperText={error.priceMessage}
                                            />
                                        </Box>
                                        <Box
                                            my={2}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <MobileDateTimePicker
                                                    label="Voucher Start Time"
                                                    value={user.startTime}
                                                    onChange={(newValue) => {
                                                        handleChangeStartTime(newValue);
                                                    }}
                                                    // minDateTime={new Date()}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            color="secondary"
                                                            sx={{
                                                                width: '100%',
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box className="fa-solid fa-calendar-day fa-lg"/>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box
                                            my={4}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <MobileDateTimePicker
                                                    label="Voucher End Time"
                                                    value={user.endTime}
                                                    onChange={(newValue) => {
                                                        handleChangeEndTime(newValue);
                                                    }}
                                                    minDateTime={user.startTime}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            color="secondary"
                                                            sx={{
                                                                width: '100%',
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box className="fa-solid fa-calendar-day fa-lg"/>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box
                                            mt={4}
                                        >
                                            <TextField
                                                color="secondary"
                                                sx={{
                                                    width: '100%',
                                                }}
                                                type='text'
                                                id="input_description"
                                                label="Description"
                                                variant="outlined"
                                                value={user.description}
                                                name='description'
                                                onChange={handleChange}
                                                multiline
                                                rows={3}
                                                error={error.nameError}
                                                helperText={error.nameMessage}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box
                                sx={{
                                    pt: 2,
                                    pl: 2,
                                    flexGrow: 1,
                                }}
                            >
                                <Box
                                    my={2}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDateTimePicker
                                            label="Voucher Release Start Time"
                                            value={value.startTime}
                                            onChange={(newValue) => {
                                                handleChangeValueStartTime(newValue);
                                            }}
                                            maxDateTime={user.startTime}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    color="secondary"
                                                    sx={{
                                                        width: '100%',
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box className="fa-solid fa-calendar-day fa-lg"/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box
                                    my={4}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDateTimePicker
                                            label="Voucher Release End Time"
                                            value={value.endTime}
                                            onChange={(newValue) => {
                                                handleChangeValueEndTime(newValue);
                                            }}
                                            minDateTime={value.startTime}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    color="secondary"
                                                    sx={{
                                                        width: '100%',
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box className="fa-solid fa-calendar-day fa-lg"/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box
                                    my={2}
                                >
                                    <TextField
                                        color="secondary"
                                        sx={{
                                            width: '100%',
                                        }}
                                        type='number'
                                        id="input_totalNum"
                                        label="total number"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <Box className="fa-solid fa-repeat fa-lg"/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                        value={value.totalNum}
                                        name='totalNum'
                                        onChange={handleChangeValue}
                                        error={error.priceError}
                                        helperText={error.priceMessage}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                        <Divider/>
                        <CardActions
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%', }}
                                onClick={() => {
                                    history('/restaurant/voucher')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ width: '100%', }}
                                onClick={() => {
                                    SubmitRequest();
                                }}
                            >
                                Submit
                            </Button>
                        </CardActions>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
