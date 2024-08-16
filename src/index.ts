import { promises as fs } from "node:fs";
import opentype from "opentype.js";
import { args } from "./args";
import { createSvg } from "./svg";

async function main() {
	const { fontPath, text, letterSpacing, fontSize, color, outputSvgPath } =
		args;

	const font = await opentype.load(fontPath);
	const svg = createSvg().setFill(color);
	const scale = fontSize / font.unitsPerEm;
	let xOffset = 0;
	let [x1, x2, y1, y2] = [0, 0, 0, 0];

	for (let i = 0; i < text.length; i++) {
		const glyph = font.charToGlyph(text[i]);

		// apply kerning
		if (i > 0) {
			const kerningValue = font.getKerningValue(
				font.charToGlyph(text[i - 1]),
				glyph,
			);
			xOffset += kerningValue * scale;
		}

		const glyphPath = glyph.getPath(xOffset, 0, fontSize);
		const bbox = glyphPath.getBoundingBox();

		// update ViewBox
		if (i === 0) x1 = bbox.x1;
		x2 = bbox.x2;
		y1 = Math.min(y1, bbox.y1);
		y2 = Math.max(y2, bbox.y2);

		if (!glyph.advanceWidth) {
			throw new Error("cannot get advanceWidth");
		}

		xOffset += glyph.advanceWidth * scale + letterSpacing;
		svg.addPath({ d: glyphPath.toPathData(2) });
	}

	const width = x2 - x1;
	const height = y2 - y1;
	svg.setViewBox({ x: x1, y: y1, width, height });
	await fs.writeFile(outputSvgPath, svg.end());
}

main().catch(console.error);
