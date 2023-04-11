import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function MenuCard(props) {

    return (
        <Card
            sx={{
                '&:hover': {
                    boxShadow: 10,
                },
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h5" component="div" sx={{ fontFamily: 'Georgia'}}>
                        {props.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color='secondary.dark' variant="h4" align='right'>
                        ${props.price}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {props.description}
                </Typography>
            </CardContent>
            <CardActions
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Button size="small" onClick={() => {props.function(props.id)}}>Delete</Button>
            </CardActions>
        </Card>
    );
}