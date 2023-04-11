import * as React from 'react';
import {
    Box, Button,
    Divider, Grid, Popover, TextField,
} from "@mui/material";

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import Message from "../Components/Message";
import MessageIcon from '@mui/icons-material/Message';
import CommentIcon from '@mui/icons-material/Comment';
import Picker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import IconButton from "@mui/material/IconButton";



export default function MessageMiddle(props) {
    const history = useNavigate();

    const { id } = useParams();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popper' : undefined;

    const [comments, setComments] = React.useState([])

    const bottomRef = React.useRef(null);

    React.useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [comments]);

    const [value, setValue] = React.useState('');

    const onEmojiClick = (event, emojiObject) => {
        setValue(value + emojiObject.emoji);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    React.useEffect(() => {
        // data['token'], data['customer_id']
        const body ={
            token: localStorage.getItem('token'),
            customer_id: id,
        }
        axios.put(`http://127.0.0.1:8000/message/channel/details`, JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
        .then((response) => {
            console.log(response);
            setComments(response.data.messages)
        })
        .catch((error) => {
            console.log(error);
        });
    }, [props.sign])

    const SendRequest = async () => {
        // data['token'], data['customer_id'], data['message']
        const body = {
            token: localStorage.getItem('token'),
            customer_id: id,
            message: value,
        }

        await axios.post('http://127.0.0.1:8000/message/send', JSON.stringify(body),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8;'
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setValue('')
                    props.function(id);
                    // console.log(response);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <Box
            sx={{
                // px: '3%',
                // width: { xs: '100%', sm: '60%' },
                flexGrow: 1,
                // height: "100vh",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
        >
            {id !== 'all'
                ?
                <React.Fragment>
                    {/*<Divider />*/}
                    {/*<br />*/}
                    <Box
                        // container
                        // spacing={3}
                        sx={{
                            height: '50vh',
                            // height: '10vh',
                            // overflow: "hidden",
                            overflowY: "scroll",
                            px: 3,
                        }}
                    >
                        {comments.map((comment, index) => (
                            <Grid item my={3}>
                                <Message
                                    name={comment.user_name}
                                    description={comment.message}
                                    date={comment.date}
                                    mine={comment.is_sender}
                                    id={comment.user_id}
                                    message_id={comment.message_id}
                                />
                            </Grid>
                        ))}
                        <div ref={bottomRef} />
                    </Box>
                    <Box
                        px={3}
                    >
                        <Divider/>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClick}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Picker onEmojiClick={onEmojiClick} native={true}/>
                        </Popover>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                my: 1
                            }}
                        >
                            <IconButton aria-describedby={id} type="button" onClick={handleClick} >
                                <AddReactionIcon/>
                            </IconButton>
                            <Button variant="contained" onClick={SendRequest}>send</Button>
                        </Box>
                        <TextField
                            color="secondary"
                            sx={{
                                width: '100%',
                            }}
                            type='text'
                            id="input_overview"
                            label="New Message"
                            variant="outlined"
                            value={value}
                            name='overview'
                            multiline
                            rows={5}
                            onChange={handleChange}
                        />
                    </Box>
                </React.Fragment>
                :
                <Box
                    my={5}
                    sx={{
                        height: '90vh',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <MessageIcon sx={{ fontSize: 300 }} color="disabled"/>
                    <Box my={15}>
                        <CommentIcon sx={{ fontSize: 300 }} color="disabled"/>
                    </Box>
                    {/*<Divider>this is the end of the page</Divider>*/}
                </Box>
            }
        </Box>

    );
}
