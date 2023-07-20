/**
 * JS module that parse patch hunks
 */

class Hunk {
    constructor() {
        this.header = null;
        this.context = "";
        this.lines = [];
    }
}

class Line {
    constructor(oldIndex, newIndex, value) {
        this.type = "unchanged";
        this.oldIndex = oldIndex;
        this.newIndex = newIndex;
        this.setOldValue(value);
        this.setNewValue(value);
    }

    setOldValue(value) {
        this.oldValue = value.slice(1);
    }

    setNewValue(value) {
        this.newValue = value.slice(1);
    }
}

function parse(patchHunks) {
    if (!patchHunks || !patchHunks.includes("@@")) {
        throw new Error("Expected argument to be valid git patch hunks");
    }

    if (patchHunks.startsWith("diff")) {
        throw new Error("Git diff files are not supported yet");
    }

    const hunks = [];
    let hunk = null;
    const lines = patchHunks.split("\n");
    const offset = {add: 0,del: 0};
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("@@")) {
            if (hunk) {
                hunks.push(hunk);
            }
            offset.add = 0;
            offset.del = 0;
            hunk = new Hunk();
            const hunkHeadParts = line.split("@@");
            if (hunkHeadParts.length < 3) throw new Error("Invalid hunk header");
            hunk.context = hunkHeadParts[2].slice(1);
            const header = hunkHeadParts[1].trim().split(" ");
            if (header.length != 2) throw new Error("Invalid hunk header");
            hunk.header = {
                oldStart: Number(header[0].split(",")[0].slice(1)),
                oldLines: Number(header[0].split(",")[1]),
                newStart: Number(header[1].split(",")[0].slice(1)),
                newLines: Number(header[1].split(",")[1])
            };
        } else {
            const newLine = new Line(hunk.header.oldStart + hunk.lines.length - offset.add, hunk.header.newStart + hunk.lines.length - offset.del, line);

            if (line.startsWith("-")) {
                if (lines[i+1].startsWith("+")) {
                    newLine.type = "changed";
                    newLine.setNewValue(lines[i+1]);
                    i++;
                } else {
                    newLine.type = "removed";
                    newLine.newIndex = null;
                    newLine.newValue = null;
                    offset.del++;
                }
            } else if (line.startsWith("+")) {
                newLine.type = "added";
                newLine.oldIndex = null;
                newLine.oldValue = null;
                offset.add++;
            }

            hunk.lines.push(newLine);
        }
    }

    hunks.push(hunk);

    return hunks;
}

module.exports = parse;
