import {Box} from "@mui/material";
import * as React from "react";

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            <Box sx={{ py: 3 }}>
                {children}
            </Box>
        </div>
    );
}