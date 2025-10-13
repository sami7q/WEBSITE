const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function collectHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectHtmlFiles(entryPath));
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            files.push(entryPath);
        }
    }
    return files;
}

const textKeys = new Set();
const attrKeys = new Set();

for (const file of collectHtmlFiles(root)) {
    const content = fs.readFileSync(file, "utf8");
    const keyRegex = /data-i18n-key="([^"]+)"/g;
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
        textKeys.add(match[1]);
    }

    const attrRegex = /data-i18n-attrs="([^"]+)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(content)) !== null) {
        attrMatch[1]
            .split(",")
            .map((segment) => segment.trim())
            .filter(Boolean)
            .forEach((segment) => {
                const parts = segment.split(":").map((part) => part.trim());
                if (parts[1]) {
                    attrKeys.add(parts[1]);
                }
            });
    }
}

console.log("TEXT_KEYS");
console.log(Array.from(textKeys).sort().join("\n"));
console.log("ATTR_KEYS");
console.log(Array.from(attrKeys).sort().join("\n"));
