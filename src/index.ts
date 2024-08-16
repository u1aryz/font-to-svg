import { promises as fs } from "node:fs";
import opentype from "opentype.js";
import { args } from "./args";
import { Svg } from "./svg";

async function main() {
	const { fontPath, text, letterSpacing, fontSize, color, outputSvgPath } =
		args;

	const font = await opentype.load(fontPath);
	const svg = new Svg().setFill(color);
	let xOffset = 0;
	let [x1, x2, y1, y2] = [0, 0, 0, 0];

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

		if (!glyph.advanceWidth) {
			throw new Error("cannot get advanceWidth");
		}

		const scaledAdvanceWidth =
			glyph.advanceWidth * (fontSize / font.unitsPerEm);
		xOffset += scaledAdvanceWidth + letterSpacing;
		svg.addPath({ d: glyphPath.toPathData(2) });
	}

	const width = x2 - x1;
	const height = y2 - y1;
	svg.setViewBox({ x: x1, y: y1, width, height });
	await fs.writeFile(outputSvgPath, svg.end());
}

main().catch(console.error);
