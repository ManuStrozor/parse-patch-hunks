/**
 * Jest tests for src/index.js
 */

const fs = require("fs");
const path = require("path");

const parse = require("../src/index");

const dataLocation = path.resolve(__dirname, "data");
let data = [];

fs.readdirSync(dataLocation).forEach((basename) => {
    if (basename.endsWith(".json")) return;
    const filename = path.parse(basename).name;
    data.push({
        name: filename,
        input: fs.readFileSync(path.resolve(dataLocation, filename+'.patch'), "utf-8"),
        expected: fs.readFileSync(path.resolve(dataLocation, filename+'.json'), "utf-8")
    });
});

describe("Throws error", () => {
    it.each([
        { argument: void 0, expectedThrow: "Expected argument to be valid git patch hunks" },
        { argument: "", expectedThrow: "Expected argument to be valid git patch hunks" },
        { argument: "diff...", expectedThrow: "Expected argument to be valid git patch hunks" },
        { argument: "diff...\n@@...", expectedThrow: "Git diff files are not supported" },
        { argument: "@@ ...", expectedThrow: "Invalid hunk header" },
        { argument: "@@ ... @@ ...", expectedThrow: "Invalid hunk header" },
    ])(">$argument<", ({ argument, expectedThrow }) => {
        expect(() => parse(argument)).toThrow(expectedThrow);
    });
});

describe("Structured object", () => {
    const input = data[0].input;
    describe("Propereties of hunks", () => {
        it.each([
            {property: "header"},
            {property: "context"},
            {property: "lines"},
        ])("$property", ({ property }) => {
            expect(parse(input)[0]).toHaveProperty(property);
        });
        describe("Propereties of header", () => {
            it.each([
                {property: "oldStart"},
                {property: "oldLines"},
                {property: "newStart"},
                {property: "newLines"},
            ])("$property", ({ property }) => {
                expect(parse(input)[0].header).toHaveProperty(property);
            });
        });
        describe("Propereties of line", () => {
            it.each([
                {property: "type"},
                {property: "oldIndex"},
                {property: "newIndex"},
                {property: "oldValue"},
                {property: "newValue"},
            ])("$property", ({ property }) => {
                expect(parse(input)[0].lines[0]).toHaveProperty(property);
            });
        });
    });
});

it.each(data)("Test Parser : $name patch", ({input, expected}) => {
    expect(parse(input)).toEqual(JSON.parse(expected));
});
