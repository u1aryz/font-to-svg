import { promises as fs } from "node:fs";
import * as d3 from "d3";
import { JSDOM } from "jsdom";
import opentype from "opentype.js";

const fontPath = "Jost-Bold.ttf";
const outputSvgPath = "output.svg";
const text = "TEST asdf";
const letterSpacing = 10;
const fontSize = 300;

async function main() {
	const font = await opentype.load(fontPath);
	const document = new JSDOM().window.document;
	const svg = d3.select(document.body).append("svg");
	svg.attr("xmlns", "http://www.w3.org/2000/svg");

	let xOffset = 0;
	let x1 = 0;
	let x2 = 0;
	let y1 = 0;
	let y2 = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const glyph = font.charToGlyph(char);
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
		svg.append("path").attr("d", glyphPath.toPathData(2));
	}

	const width = x2 - x1;
	const height = y2 - y1;
	svg.attr("viewBox", [x1, y1, width, height]);
	await fs.writeFile(outputSvgPath, document.body.innerHTML);
}

main().catch(console.error);
