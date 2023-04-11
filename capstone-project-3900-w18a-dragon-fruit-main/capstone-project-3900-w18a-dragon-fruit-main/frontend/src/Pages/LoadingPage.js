import * as React from 'react';
import { Box, Typography, } from "@mui/material";
import ButtonAppBar from './Components/LoadingHeader';

import Bingo from './Image/Binge.svg'
import homepage01 from './Image/homepage01.jpeg'
import homepage02 from './Image/homepage02.jpeg'
import homepage03 from './Image/homepage03.jpeg'
import homepage04 from './Image/homepage04.jpeg'

export default function LoadingPage() {
    return (
        <React.Fragment>
            <Box
                sx={{
                    width: 1,
                    height: "100vh",
                    backgroundImage: 'linear-gradient(to right bottom, #ee3f4d, #5dbe8a)',
                }}
            >
                <ButtonAppBar color="transparent" />
                <Box
                    position='fixed'
                    sx={{
                        width: 1,
                        height: "100vh",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundImage: `url(${homepage01})`,
                            backgroundSize: 'cover',
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundImage: `url(${homepage02})`,
                            backgroundSize: 'cover',
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundImage: `url(${homepage03})`,
                            backgroundSize: 'cover',
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundImage: `url(${homepage04})`,
                            backgroundSize: 'cover',
                        }}
                    />

                </Box>
                <Box
                    position='fixed'
                    sx={{
                        width: 1,
                        height: "100vh",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundColor: `#fff`,
                            opacity: 0.3,
                            '&:hover': {
                                opacity: 0,
                            },
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundColor: `#fff`,
                            opacity: 0.3,
                            '&:hover': {
                                opacity: 0.1,
                            },
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundColor: `#fff`,
                            opacity: 0.3,
                            '&:hover': {
                                opacity: 0.1,
                            },
                        }}
                    />
                    <Box
                        sx={{
                            width: "25%",
                            height: "100%",
                            backgroundColor: `#fff`,
                            opacity: 0.3,
                            '&:hover': {
                                opacity: 0.1,
                            },
                        }}
                    />
                </Box>
                    <Box
                        position="fixed"
                        mt='15%'
                        ml='5%'
                        sx={{
                            width: '90vw',
                            height: '40%',
                            backgroundImage: `url(${Bingo})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Typography
                            ml="5%"
                            variant="h1"
                            component="div"
                            fontSize={ 50 }
                            color='#fff'
                            sx={{
                                '&:hover': {
                                    opacity: 0.7,
                                },
                            }}
                        >
                            Eat cheaper
                            <br/>
                            Eat happier
                        </Typography>
                    </Box>
            </Box>
        </React.Fragment>
    );
}
