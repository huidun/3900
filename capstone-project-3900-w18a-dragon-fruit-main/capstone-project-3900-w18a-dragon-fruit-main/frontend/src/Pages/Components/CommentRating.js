import * as React from "react";
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#EE3F4D',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

export default function CommentRating(props) {

    return (
        <StyledRating
            name="customized-color"
            value={props.value}
            getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
            precision={props.precision}
            size={props.size}
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            readOnly={props.readOnly}
            onChange={props.onChange}
        />
    );
}