import {Box, Divider, Typography} from "@mui/material";


export default function ButtomBox() {
    return (
        <Box height='80vh'>
            <Box height='75vh'/>
            <Divider>
                <Typography sx={{fontFamily: 'Raghate, Party LET,Brush Script MT',}} color='secondary.dark'>
                    End of The Page
                </Typography>
            </Divider>
        </Box>
    )
}