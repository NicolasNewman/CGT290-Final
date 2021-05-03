/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveTreeMap } from '@nivo/treemap';
import format from 'dateformat';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

interface IScatterData {
    id: string;
    data: { x: string; y: number; quant: number; guild: string }[];
}

interface IProps {
    data: { [name: string]: Record[] };
    count: number;
}

interface IState {
    scatterData: IScatterData[];
}

export default class ItemTreemap extends Component<IProps, IState> {
    props!: IProps;
    state: IState;
    data: {
        name: 'Items';
        children: {
            name: string;
            value: number;
            avg: number;
            count: number;
        }[];
    } = { name: 'Items', children: [] };
    totalSaleCount: number = 0;
    totalSaleValue: number = 0;

    constructor(props: IProps) {
        super(props);
        const tempRecords: {
            name: string;
            value: number;
            avg: number;
            count: number;
        }[] = [];
        this.state = {
            scatterData: [
                {
                    id: '',
                    data: [],
                },
            ],
        };
        Object.keys(props.data).forEach((item) => {
            const origRecords = props.data[item];
            // const saleValue = parseInt(
            //     origRecords.reduce((prev, curr) => {
            //         return ({
            //             price: parseInt(prev.price) + parseInt(curr.price),
            //         } as unknown) as Record;
            //     }).price
            // );
            let saleValue = 0;
            let perItemSaleValue = 0;
            origRecords.forEach((rec) => {
                saleValue += parseInt(rec.price);
                perItemSaleValue += parseInt(rec.price) / parseInt(rec.quant);
            });
            tempRecords.push({
                name: item,
                value: saleValue,
                count: origRecords.length,
                avg: Math.round(perItemSaleValue / origRecords.length),
            });
        });

        tempRecords.sort((a, b) => {
            return b.value - a.value;
        });

        for (let i = 0; i < props.count; i++) {
            this.data.children.push(tempRecords[i]);
        }
        // key is each date in the list
    }

    render() {
        return (
            <div className="chart">
                <p className="interactive">
                    Click on a square to see all transactions!
                </p>
                <div style={{ width: '100%', height: '500px' }}>
                    <ResponsiveTreeMap
                        data={this.data}
                        identity="name"
                        value="value"
                        valueFormat=".03~s"
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        labelSkipSize={12}
                        labelTextColor={'#fff'}
                        parentLabelTextColor={{
                            from: 'color',
                            modifiers: [['darker', 2]],
                        }}
                        borderColor={{
                            from: 'color',
                            modifiers: [['darker', 0.1]],
                        }}
                        leavesOnly
                        // @ts-ignore
                        tooltip={(node: any) => {
                            console.log(node);
                            const data = node.node.data;
                            return (
                                <div className="tooltip">
                                    <div>
                                        <strong>{data.name}</strong>
                                        <div>Sold: {data.count}</div>
                                        <div>
                                            Total value:{' '}
                                            {data.value.toLocaleString()}
                                        </div>
                                        <div>
                                            Avg price per unit:{' '}
                                            {data.avg.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                        onClick={(square) => {
                            const name = square.id;
                            const records = this.props.data[name];
                            const newData: IScatterData = {
                                id: name,
                                data: [],
                            };
                            records.forEach((record) =>
                                newData.data.push({
                                    x: format(
                                        new Date(record.timestamp),
                                        'mm/dd/yyyy'
                                    ),
                                    y:
                                        parseInt(record.price) /
                                        parseInt(record.quant),
                                    quant: parseInt(record.quant),
                                    guild: record.guild,
                                })
                            );
                            this.setState({ scatterData: [newData] });
                        }}
                    />
                </div>
                {this.state.scatterData[0].data.length > 0 ? (
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveScatterPlot
                            data={this.state.scatterData}
                            xScale={{
                                type: 'time',
                                format: '%m/%d/%Y',
                                useUTC: false,
                                precision: 'day',
                            }}
                            xFormat="time:%m/%d/%Y"
                            yScale={{
                                type: 'linear',
                                stacked: false,
                            }}
                            axisLeft={{
                                legend: 'linear scale',
                                legendOffset: 12,
                            }}
                            axisBottom={{
                                format: '%b %d',
                                tickValues: 'every 45 days',
                                legend: 'time scale',
                                legendOffset: -12,
                            }}
                            margin={{
                                top: 20,
                                right: 110,
                                bottom: 50,
                                left: 60,
                            }}
                            theme={{ textColor: '#fff' }}
                            tooltip={(point: any) => {
                                console.log(point);
                                const { data } = point.node;
                                return (
                                    <div className="tooltip">
                                        <div>
                                            Sold {data.quant} {data.serieId} for{' '}
                                            {Math.round(data.y)} each on{' '}
                                            {data.formattedX} in {data.guild}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </div>
                ) : (
                    <span />
                )}
                <div
                    style={{
                        display: 'grid',
                        gridTemplate: '1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr',
                    }}
                >
                    {this.data.children.map((child, i) =>
                        i < 15 ? (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div>
                                    {i + 1}) {child.name}
                                </div>
                                <div>{child.value.toLocaleString()}</div>
                            </div>
                        ) : (
                            <span />
                        )
                    )}
                </div>
            </div>
        );
    }
}
