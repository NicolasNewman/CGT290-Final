/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import format from 'dateformat';

interface IProps {
    data: { [name: string]: Record[] };
    item: string;
    players: string[];
}
export default class PlayerScatterPlot extends Component<IProps> {
    props!: IProps;
    data: {
        id: string;
        data: { x: number; y: number; date: string }[];
    }[] = [];
    yMax: number = Number.MIN_VALUE;

    constructor(props: IProps) {
        super(props);
        props.players.forEach((player) => {
            const playerRecords = props.data[player].filter(
                (record) => record.item === props.item
            );
            const temp: {
                id: string;
                data: { x: number; y: number; date: string }[];
            } = {
                id: player,
                data: [],
            };
            playerRecords.forEach((record) => {
                const price = parseInt(record.price) / parseInt(record.quant);
                if (this.yMax < price) {
                    this.yMax = price;
                }
                temp.data.push({
                    x: parseInt(record.quant),
                    y: price,
                    date: record.timestamp,
                });
            });
            this.data.push(temp);
        });
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
                        xScale={{ type: 'linear', min: 0, max: 'auto' }}
                        xFormat={function (e) {
                            return e + ' pcs';
                        }}
                        yScale={{
                            type: 'linear',
                            min: 0,
                            max: 1.5 * this.yMax,
                        }}
                        yFormat={function (e) {
                            return e + 'g per';
                        }}
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
                                    `Price per unit of ${
                                        this.props.item
                                    } for players: ${this.props.players.join(
                                        ', '
                                    )}`
                                ),
                        ]}
                        tooltip={(obj: any) => {
                            const { data } = obj.node;
                            console.log(obj);
                            console.log(data);
                            return (
                                <div className="tooltip">
                                    {data.serieId} sold a stack of {data.x}{' '}
                                    {this.props.item} for {data.y}g per unit on{' '}
                                    {format(new Date(data.date), 'mm/dd/yy')}
                                </div>
                            );
                        }}
                    />
                    {/* <ResponsiveBar
                        data={this.data}
                        keys={['quant']}
                        indexBy="player"
                        groupMode="grouped"
                        margin={{
                            top: 50,
                            right: 130,
                            bottom: 50,
                            left: 60,
                        }}
                        colors={'#0f0'}
                        theme={{ textColor: '#fff' }}
                        axisLeft={null}
                        legends={[
                            {
                                anchor: 'top-right',
                                itemWidth: -10,
                                itemHeight: 20,
                                dataFrom: 'keys',
                                direction: 'column',
                            },
                        ]}
                        labelTextColor={'#fff'}
                        layers={[
                            'grid',
                            'axes',
                            'bars',
                            'markers',
                            'legends',
                            this.Title,
                        ]}
                    /> */}
                </div>
            </div>
        );
    }
}
