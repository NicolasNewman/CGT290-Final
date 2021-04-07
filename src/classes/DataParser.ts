// import { Record } from '../data_dump';
import { parse } from 'papaparse';

export default class DataParser {
    constructor() {
        parse(
            'https://raw.githubusercontent.com/NicolasNewman/CGT290-Final/master/data/data.csv',
            {
                worker: true,
                download: true,
                downloadRequestHeaders: {
                    'User-Agent': 'NicolasNewman',
                },
                step: (row) => {
                    console.log(row.data);
                },
                complete: () => {
                    console.log('Done!');
                },
                delimiter: '#',
            }
        );
    }
}
