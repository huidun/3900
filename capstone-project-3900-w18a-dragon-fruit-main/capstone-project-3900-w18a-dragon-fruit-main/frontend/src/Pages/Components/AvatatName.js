import Avatar from "@mui/material/Avatar";
import * as React from "react";

export default function AvatatName(props) {
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        string = string.length > 0 ? string : "?";
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    return (
        <Avatar
            sx={{
                bgcolor: stringToColor(props.name),
                '&:hover': {
                    boxShadow: 2,
                },
                fontFamily: 'Leaves',
                fontSize: props.size === 56 ? 42 : 30,
                width: props.size,
                height: props.size,
            }}
        >
            {props.name[0]}
        </Avatar>

    )
}
