/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveBar } from '@nivo/bar';

interface IProps {
    data: { [name: string]: Record[] };
    count: number;
}

export default class SellerBars extends Component<IProps> {
    props!: IProps;
    data: {
        player: string;
        saleCount: number;
        saleValue: number;
        nil: number;
    }[] = [];
    totalSaleCount: number = 0;
    totalSaleValue: number = 0;

    constructor(props: IProps) {
        super(props);
        const tempRecords: {
            player: string;
            saleCount: number;
            saleValue: number;
            nil: number;
        }[] = [];
        Object.keys(props.data).forEach((player) => {
            const origRecords = props.data[player];
            // const saleValue = parseInt(
            //     origRecords.reduce((prev, curr) => {
            //         return ({
            //             price: parseInt(prev.price) + parseInt(curr.price),
            //         } as unknown) as Record;
            //     }).price
            // );
            let saleValue = 0;
            origRecords.forEach((rec) => {
                saleValue += parseInt(rec.price);
            });
            const saleCount = origRecords.length;
            tempRecords.push({
                player,
                saleCount,
                saleValue,
                nil: 0,
            });

            this.totalSaleCount += saleCount;
            this.totalSaleValue += saleValue;
        });

        tempRecords.sort((a, b) => {
            return b.saleValue - a.saleValue;
        });

        for (let i = 0; i < props.count; i++) {
            this.data.push(tempRecords[i]);
        }
        // key is each date in the list
    }

    render() {
        return (
            <div className="chart">
                <div>
                    <p>
                        There was {Object.keys(this.props.data).length} unique
                        sellers, who sold {this.totalSaleCount.toLocaleString()}{' '}
                        items, valued at {this.totalSaleValue.toLocaleString()}{' '}
                        gold
                    </p>
                </div>
                <div style={{ position: 'relative', height: '300px' }}>
                    <div
                        style={{
                            width: '100%',
                            height: '300px',
                            position: 'absolute',
                        }}
                    >
                        <ResponsiveBar
                            data={this.data}
                            keys={['saleCount', 'nil']}
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
                        />
                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '300px',
                            position: 'absolute',
                            opacity: '0.5',
                        }}
                    >
                        <ResponsiveBar
                            data={this.data}
                            keys={['nil', 'saleValue']}
                            indexBy="player"
                            groupMode="grouped"
                            margin={{
                                top: 50,
                                right: 130,
                                bottom: 50,
                                left: 60,
                            }}
                            colors={'#f00'}
                            theme={{ textColor: '#fff' }}
                            enableGridY={false}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    itemWidth: -10,
                                    itemHeight: 20,
                                    dataFrom: 'keys',
                                    direction: 'column',
                                },
                            ]}
                            labelTextColor={'#fff'}
                            labelFormat={'.3~s'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
