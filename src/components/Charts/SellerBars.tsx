/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveBar } from '@nivo/bar';
import { Button, Table } from 'antd';
import format from 'dateformat';

interface ITableEntry {
    item: string;
    count: number;
    value: number;
}
interface ITableData {
    [itemName: string]: ITableEntry;
}

interface IProps {
    data: { [name: string]: Record[] };
    count: number;
}

interface IState {
    tableData: ITableEntry[];
}

export default class SellerBars extends Component<IProps, IState> {
    props!: IProps;
    state: IState;
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
        this.state = {
            tableData: [],
        };
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
                if (!isNaN(parseInt(rec.price))) {
                    saleValue += parseInt(rec.price);
                }
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
            // if (!this.totalSaleValue) {
            //     console.log(saleValue);
            // }
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
                    <p className="interactive">
                        Click the red bars to see an overview of what a seller
                        sold!
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
                            opacity: '1',
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
                            onClick={(props) => {
                                console.log(props);
                                const playerID = props.indexValue;
                                const tableData: ITableData = {};
                                this.props.data[playerID].forEach((record) => {
                                    if (!tableData[record.item]) {
                                        tableData[record.item] = {
                                            item: record.item,
                                            count: 1,
                                            value: parseInt(record.price),
                                        };
                                    } else {
                                        const entry = tableData[record.item];
                                        entry.count = entry.count + 1;
                                        entry.value =
                                            entry.value +
                                            parseInt(record.price);
                                    }
                                });
                                this.setState({
                                    tableData: Object.keys(tableData).map(
                                        (key) => tableData[key]
                                    ),
                                    // .sort(
                                    //     (a: ITableEntry, b: ITableEntry) =>
                                    //         b.value - a.value
                                    // ),
                                });
                                console.log(tableData);
                            }}
                        />
                    </div>
                </div>
                {this.state.tableData.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                bottom: '16px',
                                right: '512px',
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={(e) =>
                                    this.setState({ tableData: [] })
                                }
                            >
                                Close Table
                            </Button>
                        </div>

                        <Table
                            dataSource={this.state.tableData}
                            columns={[
                                {
                                    title: 'Item',
                                    dataIndex: 'item',
                                    key: 'item',
                                },
                                {
                                    title: 'Sold',
                                    dataIndex: 'count',
                                    key: 'count',
                                    sorter: (a, b) => a.count - b.count,
                                },
                                {
                                    title: 'Profit',
                                    dataIndex: 'value',
                                    key: 'value',
                                    sorter: (a, b) => a.value - b.value,
                                },
                            ]}
                        />
                    </div>
                ) : (
                    <span />
                )}
            </div>
        );
    }
}
