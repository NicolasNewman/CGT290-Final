/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveBar } from '@nivo/bar';

interface IProps {
    data: { [name: string]: Record[] };
    item: string;
    computeStat: (arr: number[]) => number;
    show: number;
    title: string;
}
export default class PlayerBarChart extends Component<IProps> {
    props!: IProps;
    data: {
        player: string;
        quant: number;
    }[] = [];

    constructor(props: IProps) {
        super(props);
        const recordsPerPlayer: {
            player: string;
            recordsForItem: Record[];
        }[] = [];

        Object.keys(props.data).forEach((player) => {
            const records = props.data[player];
            const recordsForItem: Record[] = [];
            records.forEach((record) => {
                if (record.item === props.item) {
                    recordsForItem.push(record);
                }
            });
            if (recordsForItem.length > 0) {
                recordsPerPlayer.push({ player, recordsForItem });
            }
        });
        console.log(recordsPerPlayer);

        recordsPerPlayer.forEach((portfolio) => {
            const records = portfolio.recordsForItem;
            const quant = records.map((record) => parseInt(record.quant));
            this.data.push({
                player: portfolio.player,
                quant: props.computeStat(quant),
            });
        });
        console.log(this.data);

        this.data.sort((a, b) => b.quant - a.quant);
        this.data = this.data.slice(0, props.show + 1);
        console.log(this.data);
    }

    Title = (obj: any) => {
        const { width, height } = obj;
        return (
            <text
                x={width / 2}
                textAnchor="middle"
                y={-15}
                fill="white"
                fontWeight="bold"
            >
                {this.props.title}
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
                    <ResponsiveBar
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
                    />
                </div>
            </div>
        );
    }
}
