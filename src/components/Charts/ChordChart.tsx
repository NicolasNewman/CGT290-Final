/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveChord } from '@nivo/chord';
import { Button, Table } from 'antd';
import format from 'dateformat';

interface IProps {
    buyers: { [name: string]: Record[] };
    sellers: { [name: string]: Record[] };
    count: number;
}

interface ITableEntry {
    name: string;
    price: number;
    date: string;
    dateName: string;
    quantity: number;
}

interface ITableData {
    direction: string[];
    s2t: ITableEntry[];
    t2s: ITableEntry[];
}

interface IState {
    tableData: ITableData;
}

/**
 * This is the most disgusting thing I have ever written in my JS career
 *
 * May the FSM have mercy on our soul...
 * @param map - an object mapping records by the opposite of @key
 * @param key - the opposite person of the map you are passing
 * @returns the data mutated from an object of records seperated by buyer/seller to an array in ascending order of the most frequently occuring buyers / sellers, with their own mapping of the most frequent sellers / buyers who interacted with them, in ascending order
 */
const mutate = (
    map: { [name: string]: Record[] },
    key: 'buyer' | 'seller',
    count: number
) => {
    return Object.keys(map)
        .map((player) => {
            const sellers: { [seller: string]: number } = map[player]
                .map((rec) => rec[key])
                .reduce((acc: { [value: string]: number }, curr) => {
                    acc[curr] = -~acc[curr];

                    return acc;
                }, {});
            return {
                records: Object.keys(sellers)
                    .map((seller) => {
                        return {
                            player: seller,
                            count: sellers[seller],
                        };
                    })
                    .sort((a, b) => b.count - a.count)
                    .slice(0, count),
                player,
            };
        })
        .sort((a, b) => b.records.length - a.records.length)
        .slice(0, count);
};

export default class ChordChart extends Component<IProps, IState> {
    props!: IProps;
    state: IState;
    matrix: number[][];
    keys: string[] = [];

    constructor(props: IProps) {
        super(props);
        this.state = {
            tableData: {
                direction: [],
                s2t: [],
                t2s: [],
            },
        };
        const sellerArr = mutate(props.sellers, 'buyer', props.count);

        let i = 0;
        const playerToIndex: { [tag: string]: number } = {};
        const pairings: { [pair: string]: number } = {};
        sellerArr.forEach((seller) => {
            seller.records.forEach((buyer) => {
                pairings[`${seller.player}-${buyer.player}`] = buyer.count;
            });
        });
        console.log(pairings);

        // const pairingCount: {
        //     [pair: string]: { forward: string; reverse: string; count: number };
        // } = {};

        Object.keys(pairings).forEach((pairing) => {
            const split = pairing.split('-');
            const reversed = `${split[1]}-${split[0]}`;
            if (!pairings[reversed]) {
                delete pairings[pairing];
            } else if (pairings[pairing] === pairings[reversed]) {
                delete pairings[pairing];
                delete pairings[reversed];
            }
        });
        console.log(pairings);

        Object.keys(pairings).forEach((pair) => {
            const split = pair.split('-');
            playerToIndex[split[0]] ??= i++;
        });
        // console.log(pairingCount);
        // console.log(pairings);
        console.log(playerToIndex);

        const tempKeys = Object.keys(playerToIndex)
            .map((entry) => {
                return { player: entry, index: playerToIndex[entry] };
            })
            .sort((a, b) => a.index - b.index);
        this.keys = tempKeys.map((rec) => rec.player);
        console.log(this.keys);

        this.matrix = Array.from(Array(this.keys.length), () =>
            Array(this.keys.length).fill(0)
        );
        // console.log(this.matrix);
        Object.keys(pairings).forEach((pair) => {
            const split = pair.split('-');
            this.matrix[playerToIndex[split[0]]][playerToIndex[split[1]]] =
                pairings[pair];
            this.matrix[playerToIndex[split[1]]][playerToIndex[split[0]]] =
                pairings[`${split[1]}-${split[0]}`];
        });
        console.log(this.matrix);
    }

    Title = (obj: any, title: string) => {
        const { center } = obj;
        console.log(obj);
        return (
            <text
                x={center[0]}
                textAnchor="middle"
                y={-60}
                fill="white"
                fontWeight="bold"
            >
                {title}
            </text>
        );
    };

    render() {
        return (
            <div className="chart">
                <p className="interactive">
                    Click a cord to see what was exchanged between players!
                </p>
                <div style={{ width: '100%', height: '500px' }}>
                    <ResponsiveChord
                        matrix={this.matrix}
                        keys={this.keys}
                        margin={{ top: 90, right: 90, bottom: 90, left: 90 }}
                        layers={[
                            'ribbons',
                            'arcs',
                            'labels',
                            'legends',
                            (obj: any) =>
                                this.Title(
                                    obj,
                                    `Read as: seller sold to buyer "n" times`
                                ),
                        ]}
                        arcTooltip={(data: any) => {
                            const { arc } = data;
                            return (
                                <div className="tooltip">
                                    {arc.id}: {arc.formattedValue}
                                </div>
                            );
                        }}
                        ribbonTooltip={(data: any) => {
                            const { ribbon } = data;
                            const { source, target } = ribbon;
                            return (
                                <div className="tooltip">
                                    <div>
                                        {source.id} sold to {target.id}{' '}
                                        {source.formattedValue} times
                                    </div>
                                    <div>
                                        {target.id} sold to {source.id}{' '}
                                        {target.formattedValue} times
                                    </div>
                                </div>
                            );
                        }}
                        colors={{ scheme: 'paired' }}
                        labelRotation={-90}
                        onRibbonClick={(ribbon, e) => {
                            console.log(ribbon);
                            const source = ribbon.source;
                            const target = ribbon.target;

                            const data: ITableData = {
                                direction: ribbon.id.split('.'),
                                s2t: [],
                                t2s: [],
                            };
                            this.props.sellers[source.id].forEach((record) => {
                                if (record.buyer === target.id) {
                                    data.s2t.push({
                                        name: record.item,
                                        price: parseInt(record.price),
                                        quantity: parseInt(record.quant),
                                        date: record.timestamp,
                                        dateName: format(
                                            new Date(record.timestamp),
                                            'mm/d/yy'
                                        ),
                                    });
                                }
                            });
                            const targetToSource = [];
                            this.props.sellers[target.id].forEach((record) => {
                                if (record.buyer === source.id) {
                                    data.t2s.push({
                                        name: record.item,
                                        price: parseInt(record.price),
                                        quantity: parseInt(record.quant),
                                        date: record.timestamp,
                                        dateName: format(
                                            new Date(record.timestamp),
                                            'mm/d/yy'
                                        ),
                                    });
                                }
                            });
                            console.log(data);
                            this.setState({ tableData: data });
                        }}
                    />
                </div>
                {this.state.tableData.s2t.length > 0 ||
                this.state.tableData.t2s.length > 0 ? (
                    <div style={{ display: 'flex' }}>
                        <div
                            style={{
                                display: 'flex',
                                position: 'relative',
                                margin: '0 auto',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    bottom: '16px',
                                    right: '586px',
                                }}
                            >
                                <Button
                                    type="primary"
                                    onClick={(e) =>
                                        this.setState({
                                            tableData: {
                                                direction: [],
                                                s2t: [],
                                                t2s: [],
                                            },
                                        })
                                    }
                                >
                                    Close Table
                                </Button>
                            </div>

                            <Table
                                style={{ marginRight: '2%' }}
                                dataSource={this.state.tableData.s2t}
                                columns={[
                                    {
                                        title: `Items sold by ${this.state.tableData.direction[1]} to ${this.state.tableData.direction[0]}`,
                                        children: [
                                            {
                                                title: 'Date',
                                                dataIndex: 'dateName',
                                                key: 'date',
                                                sorter: (a, b) => {
                                                    return (
                                                        new Date(
                                                            a.date
                                                        ).getTime() -
                                                        new Date(
                                                            b.date
                                                        ).getTime()
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Item',
                                                dataIndex: 'name',
                                                key: 'item',
                                            },
                                            {
                                                title: 'Quantity',
                                                dataIndex: 'quantity',
                                                key: 'quantity',
                                                sorter: (a, b) =>
                                                    a.quantity - b.quantity,
                                            },
                                            {
                                                title: 'Price',
                                                dataIndex: 'price',
                                                key: 'value',
                                                sorter: (a, b) =>
                                                    a.price - b.price,
                                            },
                                        ],
                                    },
                                ]}
                            />
                            <Table
                                dataSource={this.state.tableData.t2s}
                                columns={[
                                    {
                                        title: `Items sold by ${this.state.tableData.direction[0]} to ${this.state.tableData.direction[1]}`,
                                        children: [
                                            {
                                                title: 'Date',
                                                dataIndex: 'dateName',
                                                key: 'date',
                                                sorter: (a, b) => {
                                                    return (
                                                        new Date(
                                                            a.date
                                                        ).getTime() -
                                                        new Date(
                                                            b.date
                                                        ).getTime()
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Item',
                                                dataIndex: 'name',
                                                key: 'item',
                                            },
                                            {
                                                title: 'Quantity',
                                                dataIndex: 'quantity',
                                                key: 'quantity',
                                                sorter: (a, b) =>
                                                    a.quantity - b.quantity,
                                            },
                                            {
                                                title: 'Price',
                                                dataIndex: 'price',
                                                key: 'value',
                                                sorter: (a, b) =>
                                                    a.price - b.price,
                                            },
                                        ],
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ) : (
                    <span />
                )}
            </div>
        );
    }
}
