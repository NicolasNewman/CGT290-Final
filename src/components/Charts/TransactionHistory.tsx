/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../../classes/DataParser';
import { ResponsiveCalendar } from '@nivo/calendar';

interface IProps {
    data: DataTable;
    exclude?: string[];
}

export default class TransactionHistory extends Component<IProps> {
    props!: IProps;
    data: {
        day: string;
        value: number;
        guilds: { name: string; value: number }[];
    }[] = [];
    min: Date = new Date('2100-1-1');
    max: Date = new Date('1990-1-1');
    avg: number[] = [];

    constructor(props: IProps) {
        super(props);
        console.log(props);
        // key is each date in the list
        props.data.dates.forEach((key) => {
            const guilds: { [key: string]: number } = {};

            // compute the number of sales per guild for a particular date
            props.data.dateMap[key].forEach((record) => {
                guilds[record.guild] !== undefined
                    ? guilds[record.guild]++
                    : (guilds[record.guild] = 1);
            });

            // create an extra data field containing each guild and their computed number of sales
            const guildArr: { name: string; value: number }[] = [];
            Object.keys(guilds).forEach((guild) => {
                if (!props.exclude?.includes(guild)) {
                    guildArr.push({ name: guild, value: guilds[guild] });
                }
            });

            // subtract the excluded guilds from the total value
            let value = props.data.dateMap[key].length;
            props.exclude?.forEach((guild) => {
                console.log(guild);
                console.log(guilds[guild]);
                console.log(value);
                value = value - (guilds[guild] ? guilds[guild] : 0);
                console.log(value);
            });

            this.data.push({
                day: key,
                value,
                guilds: guildArr,
            });
            this.avg.push(props.data.dateMap[key].length);
            const date = new Date(key);
            if (date < this.min) {
                this.min = date;
            }
            if (date > this.max) {
                this.max = date;
            }
        });
        // for (let key in props.data.dates) {
        //     if (!props.data.dateMap[key]) {
        //         console.log(key);
        //         continue;
        //     }
        //     this.data.push({
        //         day: key,
        //         value: props.data.dateMap[key].length,
        //     });
        //     const date = new Date(key);
        //     if (date < this.min) {
        //         this.min = date;
        //     }
        //     if (date > this.max) {
        //         this.max = date;
        //     }
        // }
        console.log(this.data);
        console.log(this.min);
        console.log(this.max);
    }

    dateToString(date: Date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    dateToDayOfWeek(date: string): string {
        const d = new Date(date);
        const day = d.getDay();
        switch (day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            default:
                return 'Unknown';
        }
    }

    render() {
        console.log(this.min);
        console.log(this.max);
        return (
            <div className="chart">
                {this.props.exclude ? (
                    <span />
                ) : (
                    <div>
                        <p>
                            Transactions were recorded between{' '}
                            {this.dateToString(this.min)} and{' '}
                            {this.dateToString(this.max)}
                        </p>
                        <p>
                            The average amount of transactions per day was{' '}
                            {Math.floor(
                                this.avg.reduce((prev, curr) => prev + curr) /
                                    this.avg.length
                            )}
                        </p>
                        <p className="info">
                            The color of each square represents the number of
                            transactions that occured on that day, with orange
                            being more then green
                        </p>
                    </div>
                )}
                <div style={{ width: '100%', height: '225px' }}>
                    <ResponsiveCalendar
                        data={this.data}
                        to={this.max}
                        from={this.min}
                        tooltip={(...args) => {
                            const data = (args[0] as any).data;
                            console.log(data);
                            return (
                                <div
                                    // style={{
                                    //     padding: '0.25rem',
                                    //     backgroundColor: '#999',
                                    // }}
                                    className="tooltip"
                                >
                                    <div>
                                        <strong>
                                            {this.dateToDayOfWeek(data.day)}
                                        </strong>
                                    </div>
                                    {data.guilds ? (
                                        data.guilds.map((guild: any) => (
                                            <div
                                                style={{
                                                    padding: '0.1rem 0.5rem',
                                                }}
                                            >
                                                {guild.name}: {guild.value}
                                            </div>
                                        ))
                                    ) : (
                                        <span />
                                    )}
                                    <div
                                        style={{
                                            color: 'red',
                                            padding: '0.1rem 0.5rem',
                                        }}
                                    >
                                        Total: {data.value ? data.value : 0}
                                    </div>
                                </div>
                            );
                        }}
                        // from="2020-01-01"
                        // to="2021-05-01"
                    />
                </div>
            </div>
        );
    }
}
