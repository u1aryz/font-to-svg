import z from "zod";
import { parseArgs } from "zod-args";

const defaultValues = {
	fontPath: "fonts/SCRIPTIN.ttf",
	text: "Your text goes here",
	letterSpacing: 10,
	fontSize: 300,
	color: "#fff",
	outputSvgPath: "output.svg",
};

export const args = parseArgs({
	fontPath: z.string().optional().default(defaultValues.fontPath),
	text: z.string().optional().default(defaultValues.text),
	letterSpacing: z.number().optional().default(defaultValues.letterSpacing),
	fontSize: z.number().optional().default(defaultValues.fontSize),
	color: z
		.string()
		.regex(/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/g)
		.optional()
		.default(defaultValues.color),
	outputSvgPath: z.string().optional().default(defaultValues.outputSvgPath),
});
