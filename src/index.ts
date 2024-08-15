import { promises as fs } from "node:fs";
import opentype from "opentype.js";
import { create } from "xmlbuilder2";

const fontPath = "Jost-Bold.ttf";
const outputSvgPath = "output.svg";
const text = "Your text goes here";
const letterSpacing = 10;
const fontSize = 300;
const color = "#fff";

async function main() {
	const font = await opentype.load(fontPath);
	const svg = create().ele("svg").att("xmlns", "http://www.w3.org/2000/svg");

	let xOffset = 0;
	let x1 = 0;
	let x2 = 0;
	let y1 = 0;
	let y2 = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const glyph = font.charToGlyph(char);

		// apply kerning
		if (i > 0) {
			const previousChar = text[i - 1];
			const kerningValue = font.getKerningValue(
				font.charToGlyph(previousChar),
				glyph,
			);
			const kerningOffset = kerningValue * (fontSize / font.unitsPerEm);
			xOffset += kerningOffset;
		}

		const glyphPath = glyph.getPath(xOffset, 0, fontSize);
		const bbox = glyphPath.getBoundingBox();

		// initial x1 position
		if (i === 0) {
			x1 = bbox.x1;
		}
		// update x2 position
		x2 = bbox.x2;

		// update y1 and y2 position
		y1 = Math.min(y1, bbox.y1);
		y2 = Math.max(y2, bbox.y2);

		const scaledAdvanceWidth =
			glyph.advanceWidth * (fontSize / font.unitsPerEm);
		xOffset += scaledAdvanceWidth + letterSpacing;
		svg.ele("path").att("d", glyphPath.toPathData(2)).att("fill", color);
	}

	const width = x2 - x1;
	const height = y2 - y1;
	svg.att("viewBox", `${x1} ${y1} ${width} ${height}`);
	await fs.writeFile(
		outputSvgPath,
		svg.end({ prettyPrint: true, headless: true }),
	);
}

main().catch(console.error);
