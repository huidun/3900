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

import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import StoreToken from '../../Util/Store';
import Card from "@mui/material/Card";
import {MobileDateTimePicker} from "@mui/x-date-pickers";

export default function RestaurantVoucherAddPage() {

    const history = useNavigate();
    const [, setToken] = StoreToken();

    const [user, setUser] = React.useState({
        name: "",
        startTime: new Date(),
        endTime: new Date(new Date().getTime()+(24*60*60*1000)),
        percent: "",
        description: "",
    });

    const [value, setValue] = React.useState({
        repeatTimes: 1,
        startTime: new Date(new Date().getTime()-(24*60*60*1000)),
        endTime: new Date(new Date().getTime()-(22*60*60*1000)),
        totalNum: 1,
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

    const [error, setError] = React.useState({
        nameError: false,
        nameMessage: " ",
        priceError: false,
        priceMessage: " ",
    });

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
        // console.log(user.startTime.toISOString(),)
        const body = {
            token: localStorage.getItem('token'),
            voucher: {
                voucher_name: user.name,
                start_time: user.startTime.toISOString(),
                end_time: user.endTime.toISOString(),
                discount: user.percent,
                description: user.description,
            },
            total_number: value.totalNum,
            start_release_time: value.startTime.toISOString(),
            end_release_time: value.endTime.toISOString(),
            repetitions: value.repeatTimes,
        }
        console.log(body)

        await axios.post('http://127.0.0.1:8000/restaurant/voucher/add', JSON.stringify(body),
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
                            title='Add Voucher'
                            subheader="add Voucher here"
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
                                        id="input_repeatTimes"
                                        label="Repeat Times"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <Box className="fa-solid fa-repeat fa-lg"/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                        value={value.repeatTimes}
                                        name='repeatTimes'
                                        onChange={handleChangeValue}
                                        error={error.priceError}
                                        helperText={error.priceMessage}
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
                            {/*{value.endTime.toISOString()}*/}
                            {/*<br/>*/}
                            {/*{value.endTime.toLocaleString()}*/}
                            {/*<br/>*/}
                            {/*{value.endTime.toString()}*/}
                            {/*<br/>*/}
                            {/*{value.endTime.toUTCString()}*/}
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
