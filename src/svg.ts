import { create } from "xmlbuilder2";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces";

type ViewBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type SvgPathAttributes = {
	d: string;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	// TODO others...
};

export function createSvg() {
	const builder: XMLBuilder = create().ele("svg", {
		xmlns: "http://www.w3.org/2000/svg",
	});

	return {
		setFill(color: string) {
			builder.att("fill", color);
			return this;
		},

		setStroke(color: string, width?: number) {
			builder.att("stroke", color);
			if (width) builder.att("stroke-width", `${width}px`);
			return this;
		},

		addPath(attrs: SvgPathAttributes) {
			builder.ele("path", { ...attrs });
			return this;
		},

		setViewBox({ x, y, width, height }: ViewBox) {
			builder.att("viewBox", `${x} ${y} ${width} ${height}`);
			return this;
		},

		end() {
			return builder.end({ prettyPrint: true, headless: true });
		},
	};
}
