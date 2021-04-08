/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../../classes/DataParser';
import { ResponsiveCalendar } from '@nivo/calendar';

interface IProps {
    data: DataTable;
}

export default class TransactionHistory extends Component<IProps> {
    props!: IProps;
    data: { day: string; value: number }[] = [];
    min: Date = new Date('2100-1-1');
    max: Date = new Date('1990-1-1');

    constructor(props: IProps) {
        super(props);
        console.log(props);
        props.data.dates.forEach((key) => {
            this.data.push({
                day: key,
                value: props.data.dateMap[key].length,
            });
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

    render() {
        return (
            <div style={{ width: '100%', height: '225px' }}>
                <ResponsiveCalendar
                    data={this.data}
                    to={this.max}
                    from={this.min}
                    // from="2020-01-01"
                    // to="2021-05-01"
                />
            </div>
        );
    }
}
