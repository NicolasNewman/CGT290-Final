from datetime import datetime
from read import find_all_files
from read import process_files
from anonymizer import AnonymizerFactory
from multiprocessing import Pool, Manager
from itertools import chain


def process_func(item_desc, sale):
    buyer = sale[0][1]
    guild = sale[1][1]
    item_id = sale[2][1]
    item_link = sale[3][1]
    price = sale[4][1]
    quant = sale[5][1]
    seller = sale[6][1]
    timestamp = sale[7][1]
    timestamp_str = datetime.fromtimestamp(timestamp)
    was_kiosk = sale[8][1]

    return f'{item_desc}#{guild}#{buyer}#{seller}#{price}#{quant}#{timestamp_str}#{item_link}\n'


def process_anon(record, anonymizer):
    split = record.split("#")
    split[2] = anonymizer(split[2])
    split[3] = anonymizer(split[3])
    return "#".join(split)


def dump_tableau(filename='data_dump.csv'):
    files = find_all_files()
    lines = []
    with Manager() as m:
        arg_map = [[[x], process_func, [i + 1, len(files)]] for i, x in enumerate(files)]
        with m.Pool(5) as p:
            lines = p.starmap(process_files, arg_map)
        print('Done reading all files')
    flattened = list(chain(*lines))
    unique = list(set(flattened))
    print(f"Removed {len(flattened) - len(unique)} duplicate lines")
    print(f"Collected {len(unique)} sales")

    anonymizer, load, save = AnonymizerFactory({})
    load()
    for i, s in enumerate(unique):
        unique[i] = process_anon(s, anonymizer)
    save()

    with open(filename, 'w') as f:
        f.write('item#guild#buyer#seller#price#quant#timestamp#itemlink\n')
        f.writelines(unique)

