/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

interface IProps {
    data: { [name: string]: Record[] };
    item: string;
    dateStart: Date;
    dateEnd: Date;
}
export default class ItemScatterPlot extends Component<IProps> {
    props!: IProps;
    data: {
        id: string;
        data: { x: string; y: number }[];
    }[] = [];

    constructor(props: IProps) {
        super(props);
        const entries: {
            [key: string]: {
                id: string;
                data: { x: string; y: number }[];
            };
        } = {};
        props.data[props.item].forEach((record) => {
            const recordDate = new Date(record.timestamp);
            if (recordDate > props.dateStart && recordDate < props.dateEnd) {
                // entry.data.push({
                //     x: record.timestamp.split(' ')[0],
                //     y: parseInt(record.price) / parseInt(record.quant),
                // });
                if (!entries[record.guild]) {
                    entries[record.guild] = {
                        id: record.guild,
                        data: [
                            {
                                x: record.timestamp.split(' ')[0],
                                y:
                                    parseInt(record.price) /
                                    parseInt(record.quant),
                            },
                        ],
                    };
                } else {
                    entries[record.guild].data.push({
                        x: record.timestamp.split(' ')[0],
                        y: parseInt(record.price) / parseInt(record.quant),
                    });
                }
            }
        });
        Object.keys(entries).forEach((entry) => this.data.push(entries[entry]));
    }

    Title = (obj: any, title: string) => {
        const { innerWidth } = obj;
        console.log(obj);
        return (
            <text
                x={innerWidth / 2}
                textAnchor="middle"
                y={-15}
                fill="white"
                fontWeight="bold"
            >
                {title}
            </text>
        );
    };

    formatDate(d: Date) {
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        width: '100%',
                        height: '300px',
                    }}
                >
                    <ResponsiveScatterPlot
                        data={this.data}
                        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            precision: 'day',
                        }}
                        xFormat="time:%Y-%m-%d"
                        // yScale={{
                        //     type: 'linear',
                        //     min: 0,
                        //     // max: 1.5 * this.yMax,
                        // }}
                        // yFormat={function (e) {
                        //     return e + 'g';
                        // }}
                        axisBottom={{
                            format: '%b %d',
                            tickValues: 'every 2 days',
                        }}
                        colors={{ scheme: 'category10' }}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                        theme={{ textColor: '#fff' }}
                        layers={[
                            'grid',
                            'axes',
                            'nodes',
                            'markers',
                            'legends',
                            (obj) =>
                                this.Title(
                                    obj,
                                    `Sales of ${
                                        this.props.item
                                    } between ${this.formatDate(
                                        this.props.dateStart
                                    )} to ${this.formatDate(
                                        this.props.dateEnd
                                    )}`
                                ),
                        ]}
                        tooltip={(obj: any) => {
                            const { data } = obj.node;
                            return (
                                <div className="tooltip">
                                    <div>Guild: {data.serieId}</div>
                                    <div>Date: {data.formattedX}</div>
                                    <div>Price: {data.formattedY}g</div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }
}
