from datetime import datetime
from read import find_all_files
from read import process_files


def process_func(item_desc, sale):
    buyer = str(sale[0][1]).replace("'", "\\'").replace('"', '\\"')
    guild = sale[1][1]
    item_id = sale[2][1]
    item_link = sale[3][1]
    price = sale[4][1]
    quant = sale[5][1]
    seller = str(sale[6][1]).replace("'", "\\'").replace('"', '\\"')
    timestamp = sale[7][1]
    timestamp_str = datetime.fromtimestamp(timestamp)
    was_kiosk = sale[8][1]

    item_name = str(item_desc).replace("'", "\\'").replace('"', '\\"')

    return f'\t{{\n' \
           f'\t\tname: \'{item_name}\',\n' \
           f'\t\tbuyer: \'{buyer}\',\n' \
           f'\t\tguild: \'{guild}\',\n' \
           f'\t\tid: \'{item_id}\',\n' \
           f'\t\titemLink: \'{item_link}\',\n' \
           f'\t\tprice: {price},\n' \
           f'\t\tquant: {quant},\n' \
           f'\t\tseller: \'{seller}\',\n' \
           f'\t\ttimestamp: {timestamp},\n' \
           f'\t\tkiosk: {str(was_kiosk).lower()}\n' \
           f'\t}},\n'


def dump_js(filename='data_dump.ts'):
    data = process_files(find_all_files(), process_func)
    with open(filename, 'w') as f:
        f.write('export interface Record {\n')
        f.write('\tname: string;\n')
        f.write('\tbuyer: string;\n')
        f.write('\tguild: string;\n')
        f.write('\tid: string;\n')
        f.write('\titemLink: string;\n')
        f.write('\tprice: number;\n')
        f.write('\tquant: number;\n')
        f.write('\tseller: string;\n')
        f.write('\ttimestamp: string;\n')
        f.write('\tkiosk: boolean;\n')
        f.write('}\n')
        f.write('const data: Record[] = [\n')
        f.writelines(data)
        f.write(']\n')
        f.write('export default data\n')
