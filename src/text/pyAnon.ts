const str = `anon_dict = {}
i = 1

def load(filename='dict.csv'):
    global anon_dict
    global i
    with open(filename, 'r') as f:
        for line in f:
            (key, val) = line.split(',')
            anon_dict[key] = val
            i += 1

def get(name):
    global anon_dict
    global i
    if name not in anon_dict:
        anon_dict[name] = f'@{i}'
        i += 1
    return anon_dict[name]


def save(filename='dict.csv'):
    global anon_dict
    with open(filename, 'w') as f:
        for key in anon_dict:
            f.write(f'{key},{anon_dict[key]}\n')
`;

export default str;
