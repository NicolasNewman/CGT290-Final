/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveLine } from '@nivo/line';

interface IProps {
    data: { [name: string]: Record[] };
}

export default class SellerBars extends Component<IProps> {
    props!: IProps;
    data: {
        id: string;
        data: {
            x: string;
            y: number;
        }[];
    }[] = [];

    constructor(props: IProps) {
        super(props);

        const motifs = Object.keys(props.data)
            .filter((item) => {
                return /Crafting Motif [0-9]{1,2}: .*Chests/.test(item);
            })
            .filter((motif) => {
                // return /.*Akaviri.*|.*Daggerfall.*|.*Order.*|.*Silver.*|.*Honor.*|.*Meridian.*|.*Dragonguard.*|.*Refabricated.*|.*Icereach.*/.test(
                return /.*Honor.*|.*Silver.*|.*Refabricated.*|.*Meridian.*|.*Order.*|.*Icereach.*/.test(
                    motif
                );
            });
        console.log(motifs);

        motifs.forEach((key) => {
            const tempRecord: {
                id: string;
                data: {
                    x: string;
                    y: number;
                }[];
            } = {
                id: key,
                data: [],
            };
            const records = props.data[key];
            const earliestDate = new Date('3/25/2021');
            records.forEach((record) => {
                const date = new Date(record.timestamp);
                if (date > earliestDate)
                    tempRecord.data.push({
                        x: this.formatDate(date),
                        y: parseInt(record.price),
                    });
            });

            const temp: { [value: string]: { x: string; y: number } } = {};
            const count: { [value: string]: number } = {};
            tempRecord.data.forEach((point) => {
                if (temp[point.x]) {
                    temp[point.x].y = temp[point.x].y + point.y;
                    count[point.x] += 1;
                } else {
                    temp[point.x] = point;
                    count[point.x] = 1;
                }
            });
            tempRecord.data.map((point) => {
                return { x: point.x, y: point.y / count[point.x] };
            });

            tempRecord.data = Object.values(temp);
            tempRecord.data.sort(
                (a, b) => (new Date(b.x) as any) - (new Date(a.x) as any)
            );

            this.data.push(tempRecord);
        });
        this.data.push({
            id: 'Anniversary Event Start',
            data: [
                { x: '4/1/2021', y: 0 },
                { x: '4/1/2021', y: 280000 },
            ],
        });
    }

    formatDate(d: Date) {
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    render() {
        console.log(this.data);
        return (
            <div>
                <div
                    style={{
                        width: '100%',
                        height: '500px',
                    }}
                >
                    <ResponsiveLine
                        data={this.data}
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
                            tickValues: 'every 4 days',
                            legend: 'time scale',
                            legendOffset: -12,
                        }}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        theme={{ textColor: '#fff' }}
                        useMesh
                        curve="monotoneX"
                        colors={{ scheme: 'paired' }}
                        legends={[
                            {
                                anchor: 'top-right',
                                direction: 'column',
                                itemWidth: 150,
                                itemHeight: 20,
                                translateX: 10,
                            },
                        ]}
                        enableSlices={false}
                    />
                </div>
            </div>
        );
    }
}
