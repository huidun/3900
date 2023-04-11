import {Box, IconButton} from "@mui/material";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

export default function RestaurantListButtons(props) {

    const history = useNavigate();

    return (
        <Box
            position='fixed'
            sx={{
                mt: 10,
                ml: 2,
                display: localStorage.getItem('token') ? 'flex' : "none",
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}
        >
            <IconButton
                type="button"
                onClick={() => {props.function(); history('/restaurants/toplist')}}
            >
                <MilitaryTechIcon fontSize="large"/>
            </IconButton>
            <IconButton
                type="button"
                onClick={() => {props.function(); history('/restaurants/cuisine')}}
            >
                <LoyaltyIcon fontSize="large"/>
            </IconButton>
            <IconButton
                type="button"
                onClick={() => {props.function(); history('/restaurants/search')}}
            >
                <ManageSearchIcon fontSize="large"/>
            </IconButton>
        </Box>
    );
}