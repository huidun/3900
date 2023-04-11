import * as React from 'react';
import {
    Box,
    Button,
    Divider, ImageList, ImageListItem,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import ButtomBox from "../Components/ButtomBox";

const getBase64 = (file) => {
    return new Promise(resolve => {
        let fileInfo;
        let baseURL = "";
        // Make new FileReader
        let reader = new FileReader();

        // Convert the file to base64 text
        reader.readAsDataURL(file);

        // on reader load somthing...
        reader.onload = () => {
            // Make a fileInfo Object
            // console.log("Called", reader);
            baseURL = reader.result;
            // console.log(baseURL);
            resolve(baseURL);
            return reader.result;
        };
        // console.log(fileInfo);
    });
};

function dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}

export default function RestaurantPhotoShowPage() {
    const history = useNavigate();

    const { id } = useParams();

    const [pictures, setPictures] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/pictures/all`, {
            params: {
                id,
            },})
            .then((response) => {
                console.log(response);
                setPictures(response.data.all_pictures)
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
                        Images
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
                            <Button
                                // my={3}
                                variant="contained"
                                component="label"
                                onClick={() => {history(`/restaurant/${id}`)}}
                                sx={{ width: 1, }}
                            >
                                Back
                            </Button>
                            <br />
                            <Divider/>
                            <Box sx={{
                                width: 1,
                                // height: 450,
                                // overflowY: 'scroll'
                            }}>
                                <ImageList
                                    variant="masonry"
                                    cols={3}
                                    gap={10}
                                    // container
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    {pictures.map((item) => (
                                        <ImageListItem
                                            key={item.id}
                                            sx={{
                                                '&:hover': {
                                                    boxShadow: 5,
                                                },
                                            }}
                                        >
                                            <img
                                                src={`${item.picture}`}
                                                // srcSet={`${item.picture}?w=500&fit=crop&auto=format&dpr=2 2x`}
                                                alt={item.id}
                                                loading="lazy"
                                            />
                                            {/*<ImageListItemBar*/}
                                            {/*    title={item.picture}*/}
                                            {/*    // subtitle={<span>by: {item.author}</span>}*/}
                                            {/*    position="below"*/}
                                            {/*/>*/}
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                            <ButtomBox />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}
