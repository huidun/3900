import * as React from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Divider, FormControl, Grid, InputLabel, Select,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ProfileLeft from "../Components/ProfileLeft";
import Comment from '../Components/Comment'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RateBarChart from "../Components/RateBarChart";
import MenuItem from "@mui/material/MenuItem";
import ButtomBox from "../Components/ButtomBox";



export default function RestaurantCommitsPage() {
    const history = useNavigate();

    const [comments, setComments] = React.useState([])

    const [order, setOrder] = React.useState('time');

    const handleChangeOrder = (event) => {
        setOrder(event.target.value);
    };

    const [value, setValue] = React.useState(0);

    const [data, setData] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/comment/details/orderby`, {
            params: {
                r_id: localStorage.getItem('id'),
                condition: order,
            },})
            .then((response) => {
                console.log(response);
                setComments(response.data.comments)
                setValue(response.data.total)
                setData(response.data.rate)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [order])

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
                        Comments
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
                        <ProfileLeft select={'Comments'}/>
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
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Typography variant='h3' sx={{ fontFamily: 'Georgia', color: 'primary.dark'}}>
                                    Total: {value}
                                </Typography>
                            </Box>
                            <br />
                            <Box>
                                <Accordion my={3}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>Chart</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <RateBarChart data={data}/>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                            <br/>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Order by</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={order}
                                    label="Order by"
                                    onChange={handleChangeOrder}
                                >
                                    <MenuItem value={'time'}>Time</MenuItem>
                                    <MenuItem value={'-time'}>Reverse Time</MenuItem>
                                    <MenuItem value={'rating'}>Scoring</MenuItem>
                                    <MenuItem value={'-rating'}>Reverse Scoring</MenuItem>
                                </Select>
                            </FormControl>
                            <br/>
                            <Divider/>
                            <br />
                            <Grid
                                container
                                spacing={3}
                            >
                                {comments.map((comment) => (
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Comment
                                            name={comment.name}
                                            description={comment.review}
                                            rate={comment.rate}
                                            date={comment.date}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <ButtomBox />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
