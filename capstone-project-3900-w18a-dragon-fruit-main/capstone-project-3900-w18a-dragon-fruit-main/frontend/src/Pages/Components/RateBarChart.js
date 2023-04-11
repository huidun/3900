import {ResponsiveContainer, Tooltip, RadialBarChart, RadialBar, Legend} from 'recharts';

export default function RateBarChart(props) {
    return (
        <ResponsiveContainer width="100%" height={400} >
            <RadialBarChart
                innerRadius="20%"
                outerRadius="100%"
                data={props.data}
                // startAngle={180}
                // endAngle={0}
            >
                <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise dataKey='num' />
                <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                <Tooltip />
            </RadialBarChart>
        </ResponsiveContainer>
    );
}