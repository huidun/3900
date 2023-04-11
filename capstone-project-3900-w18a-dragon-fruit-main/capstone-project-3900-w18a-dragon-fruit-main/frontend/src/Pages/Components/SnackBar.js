import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function SimpleSnackbar(props) {

    return (
        <React.Fragment>
            <Snackbar
                open={props.open}
                autoHideDuration={6000}
                // severity={props.severity}
                onClick={() =>{props.function()}}
                onClose={() =>{props.function()}}
                sx={{ width: { xs: '90%', sm: '30%' } }}
                // message={props.message}
                // action={action}
            >
                <MuiAlert onClose={() =>{props.function()}} elevation={6} severity={props.severity} sx={{ width: '100%' }}>
                    {props.message}
                </MuiAlert>
            </Snackbar>
        </React.Fragment>
    );
}
