/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { Record } from '../../classes/DataParser';
import { ResponsiveTreeMap } from '@nivo/treemap';

interface IProps {
    data: { [name: string]: Record[] };
    count: number;
}

export default class ItemTreemap extends Component<IProps> {
    props!: IProps;
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
            <div>
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
                        // @ts-ignore
                        tooltip={(node: any) => {
                            console.log(node);
                            const data = node.node.data;
                            return (
                                <div
                                    style={{
                                        padding: ' 0.25rem 1rem',
                                    }}
                                >
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
                            // return (
                            //     <div
                            //         style={{
                            //             padding: '0.25rem',
                            //             backgroundColor: '#999',
                            //         }}
                            //     >
                            //         <div>
                            //             <strong>
                            //                 {this.dateToDayOfWeek(data.day)}
                            //             </strong>
                            //         </div>
                            //         {data.guilds ? (
                            //             data.guilds.map((guild: any) => (
                            //                 <div
                            //                     style={{
                            //                         padding: '0.1rem 0.5rem',
                            //                     }}
                            //                 >
                            //                     {guild.name}: {guild.value}
                            //                 </div>
                            //             ))
                            //         ) : (
                            //             <span />
                            //         )}
                            //         <div
                            //             style={{
                            //                 color: 'red',
                            //                 padding: '0.1rem 0.5rem',
                            //             }}
                            //         >
                            //             Total: {data.value ? data.value : 0}
                            //         </div>
                            //     </div>
                            // );
                        }}
                    />
                </div>
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
