/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveChord } from '@nivo/chord';

interface IProps {
    buyers: { [name: string]: Record[] };
    sellers: { [name: string]: Record[] };
    count: number;
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

export default class ChordChart extends Component<IProps> {
    props!: IProps;
    matrix: number[][];
    keys: string[] = [];

    constructor(props: IProps) {
        super(props);
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
                            console.log(data);
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
                    />
                </div>
            </div>
        );
    }
}
