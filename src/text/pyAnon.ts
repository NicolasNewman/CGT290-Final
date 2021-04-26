const str = `def AnonymizerFactory(d):
    i = 1

    def anonymizer(name):
        nonlocal i
        if name not in d:
            d[name] = f'@{i}'
            i += 1
        return d[name]

    def load(filename='dict.csv'):
        nonlocal i
        try:
            with open(filename, 'r') as f:
                for line in f:
                    (key, val) = line.split(',')
                    d[key] = val
                    i += 1
        except FileNotFoundError:
            print(f"Mappings [{filename}] does not exist, skipping pre-load")

    def save(filename='dict.csv'):
        with open(filename, 'w') as f:
            for key in d:
                f.write(f'{key},{d[key]}\n')

    return anonymizer, load, save`;

export default str;
