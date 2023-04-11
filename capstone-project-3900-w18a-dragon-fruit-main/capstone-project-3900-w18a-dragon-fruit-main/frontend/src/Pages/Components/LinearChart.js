import {LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import * as React from "react";
import axios from "axios";

export default function LinearChart(props) {

    const [data, setData] = React.useState([])

    React.useEffect(() => {
        axios.get(`http://127.0.0.1:8000/restaurant/voucher/summary`, {
            params: {
                id: localStorage.getItem('id'),
            },})
            .then((response) => {
                console.log(response);
                setData(response.data.summary)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    return (
        <ResponsiveContainer width="100%" height={400} >
            <LineChart data={data} margin={{ top: 5, right: 40, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="sale" stroke="#899668" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}