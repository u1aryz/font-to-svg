import { create } from "xmlbuilder2";
import type { XMLBuilder } from "xmlbuilder2/lib/interfaces";

export class Svg {
	private builder: XMLBuilder;

	constructor() {
		this.builder = create().ele("svg", {
			xmlns: "http://www.w3.org/2000/svg",
		});
	}

	public setFill(color: string): Svg {
		this.builder.att("fill", color);
		return this;
	}

	public addPath({ d }: { d: string }): Svg {
		this.builder.ele("path", { d });
		return this;
	}

	public setViewBox({
		x,
		y,
		width,
		height,
	}: { x: number; y: number; width: number; height: number }): Svg {
		this.builder.att("viewBox", `${x} ${y} ${width} ${height}`);
		return this;
	}

	public end(): string {
		return this.builder.end({ prettyPrint: true, headless: true });
	}
}
