import * as React from 'react';
import {
    Box,
    Button,
    Divider, ImageList, ImageListItem,
    Typography,
} from "@mui/material";
import ButtonAppBar from '../Components/LoadingHeader';

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SnackBar from "../Components/SnackBar";
import ProfileLeft from "../Components/ProfileLeft";
import CardMedia from "@mui/material/CardMedia";
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

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}


// const itemData = [
//     {
//         img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
//         title: 'Bed',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
//         title: 'Books',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
//         title: 'Sink',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
//         title: 'Kitchen',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
//         title: 'Blinds',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
//         title: 'Chairs',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
//         title: 'Laptop',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
//         title: 'Doors',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
//         title: 'Coffee',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
//         title: 'Storage',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
//         title: 'Candle',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
//         title: 'Coffee table',
//     },
// ];


export default function RestaurantPhotoPage() {
    const history = useNavigate();

    const [path, setPath] = React.useState('')

    const handleChange = (event) => {
        const dataUrl = getDataUrl(event.currentTarget);
        console.log(dataUrl)
        setPath(URL.createObjectURL(event.target.files[0]));
        // setPath(URL.createObjectURL(dataURLtoFile('', 'name')))
        // setPath(getDataUrl(event.target.files[0]));
    };

    const [pictures, setPictures] = React.useState([])

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

    const upLoadRequest = async (event) => {

        // const form = new FormData();
        // form.append(item.name, fs.createReadStream(path));
        // var self = this
        console.log(event.target);
        let file = event.target.files[0]
        /* eslint-disable no-undef */
        let param = new FormData()  // 创建form对象
        param.append('picture', file, file.name)// URL.createObjectURL(file))  // 通过append向form对象添加数据
        param.append('token', localStorage.getItem('token')) // 添加form表单中其他数据
        // console.log("222222");
        // console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去

        // const body = {
        //     token: localStorage.getItem('token'),
        //     picture: path,
        // }
        console.log(param)
        for (const key of param.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        await axios.post('http://127.0.0.1:8000/restaurant/picture/add', param, {
            headers: {
                'Content-Type': 'multipart/form-data; charset=utf-8;'
            }
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setSign(!sign)
                    // handleOpenSnack("Menu Deleted", "warning")
                    setPath("")
                }
            })
            .catch((error) => {
                console.log(error)
                handleOpenSnack(error.response.data.description, "error")
            });
    }


    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/pictures/all`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setPictures(response.data.all_pictures)
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
                        <ProfileLeft select={'Images'}/>
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
                                    mb: 2,
                                    // mx: { xs: '5vw', sm: '2.5vw' },
                                    // width:  { xs: '90vw', sm: '45vw' },
                                    // flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Box mb={2}
                                     mt={{ xs: 3, sm: 0 }}
                                     sx={{
                                         display: path === '' ? 'none': 'block',
                                     }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="400"
                                        sx={{
                                            '&:hover': {
                                                boxShadow: 5,
                                            },
                                        }}
                                        image={path}
                                        alt={'uuu'}
                                    />
                                    <br />
                                    <Button
                                        // my={3}
                                        variant="outlined"
                                        component="label"
                                        onClick={() => {upLoadRequest();}}
                                        sx={{
                                            width: 1,
                                        }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
                                <Button
                                    // my={3}
                                    variant="contained"
                                    component="label"
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={upLoadRequest}
                                        hidden
                                    />
                                </Button>
                                {/*{path}*/}
                            </Box>
                            <br/>
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
                                        </ImageListItem>
                                    ))}
                                </ImageList>
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
