import * as React from "react";
import axios from "axios";
import {Box, Divider, Grid, Tab, Tabs} from "@mui/material";
import TabPanel from "./TabPanel";
import FriendCard from "./FriendCard";
import {useNavigate, useParams} from "react-router-dom";

export default function FriendRight(props) {

    const history = useNavigate();

    const [follower, setFollower] = React.useState([])
    const [following, setFollowing] = React.useState([])

    const { id } = useParams();

    // const [value, setValue] = React.useState(id);

    const handleChange = (event, newValue) => {
        if (newValue === 'following') {
            history('/friends/following')
        } else {
            history('/friends/followers')
        }
    };

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/customer/friends/all`, {
            params: {
                customer_id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setFollower(response.data.follower)
                setFollowing(response.data.following)
                // setMenus(response.data.all_dishes)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [props.sign])

    return (
        <React.Fragment>
            <Box>
                <Tabs
                    value={id}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="wrapped label tabs example"
                >
                    <Tab value={"followers"} label="Followers" />
                    <Tab value={"following"} label="Following" />
                </Tabs>
            </Box>
            {/*<br/>*/}
            <Divider/>
            <TabPanel value={id} index={"followers"}>
                <Grid
                    container
                    spacing={3}
                >
                    {follower.map((menu) => (
                        <Grid item xs={12} sm={12} md={6}>
                            <FriendCard
                                name={menu.name}
                                email={menu.email}
                                id={menu.id}
                                function={props.deleteRequest}
                                follow={'follow'}
                            />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>
            <TabPanel value={id} index={"following"}>
                <Grid
                    container
                    spacing={3}
                >
                    {following.map((menu) => (
                        <Grid item xs={12} sm={12} md={6}>
                            <FriendCard
                                name={menu.name}
                                email={menu.email}
                                id={menu.id}
                                function={props.deleteRequest}
                                follow={'unfollow'}
                            />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>
        </React.Fragment>
    );
}