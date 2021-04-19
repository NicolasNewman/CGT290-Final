const str = `from datetime import datetime
from read import find_all_files
from read import process_files
from anonymizer import get


def process_func(item_desc, sale):
    buyer = get(sale[0][1])
    guild = sale[1][1]
    item_id = sale[2][1]
    item_link = sale[3][1]
    price = sale[4][1]
    quant = sale[5][1]
    seller = get(sale[6][1])
    timestamp = sale[7][1]
    timestamp_str = datetime.fromtimestamp(timestamp)
    was_kiosk = sale[8][1]

    return f'{item_desc}#{guild}#{buyer}#{seller}#{price}#{quant}#{timestamp_str}\n'


def dump_tableau(filename='data_dump.csv'):
    data = process_files(find_all_files(), process_func)
    with open(filename, 'w') as f:
        f.write('item#guild#buyer#seller#price#quant#timestamp\n')
        f.writelines(data)
`;

export default str;
