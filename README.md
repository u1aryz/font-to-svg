# font-to-svg
Generates SVG file from text and font files using `Bun`.

Probably works in `Node.js` as well.

Output sample:

<img width="400px" src="art/sample1.svg" alt="sample">
<img width="400px" src="art/sample2.svg" alt="sample">

## Getting started
```bash
git clone --depth=1 git@github.com:u1aryz/font-to-svg.git
cd font-to-svg
bun i
```

To Run:
```bash
bun start \
  --fontPath=fonts/SCRIPTIN.ttf \
  --text=\"text here\" \
  --letterSpacing=10 \
  --fontSize=300 \
  --color=#0e7490 \
  --outputSvgPath=output.svg
```

Show Help:
```bash
bun start --help
```

Check the default values from [here](https://github.com/u1aryz/font-to-svg/blob/b7cca3028831e04161363ddaf4911e3461a19479/src/args.ts#L4).

## License
[MIT License](LICENSE)
