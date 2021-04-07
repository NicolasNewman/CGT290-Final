// import { Record } from '../data_dump';
import { parse } from 'papaparse';

export default class DataParser {
    constructor() {
        const data = [];
        fetch('NicolasNewman/CGT290-Final/master/data/data.csv')
            .then((res) => res.text())
            .then((text) => {
                parse(text, {
                    worker: true,

                    step: (row) => {
                        data.push(row);
                    },
                    complete: () => {
                        console.log('Done!');
                        console.log(data[0]);
                        console.log(data.length);
                    },
                    delimiter: '#',
                });
            });
        // parse(
        //     'https://raw.githubusercontent.com/NicolasNewman/CGT290-Final/master/data/data.csv',
        //     {
        //         worker: true,
        //         download: true,
        //         downloadRequestHeaders: {
        //             'User-Agent': 'NicolasNewman',
        //         },
        //         step: (row) => {
        //             console.log(row.data);
        //         },
        //         complete: () => {
        //             console.log('Done!');
        //         },
        //         delimiter: '#',
        //     }
        // );
    }
}
