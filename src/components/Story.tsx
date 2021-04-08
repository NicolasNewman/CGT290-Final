/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component } from 'react';
import { DataTable } from '../classes/DataParser';
import TransactionHistory from './Charts/TransactionHistory';

interface IProps {
    data: DataTable;
}

export default class Story extends Component<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Transaction History</h1>
                <TransactionHistory data={this.props.data} />
            </div>
        );
    }
}
