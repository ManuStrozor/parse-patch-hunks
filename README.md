# parse-patch-hunks

[![npm version](https://badge.fury.io/js/parse-patch-hunks.svg)](https://badge.fury.io/js/parse-patch-hunks)

Patch hunks analysis made easy and simple

## Installation

`npm i parse-patch-hunks`

## Usage

```patch
@@ -4303,7 +4303,7 @@ const getCurrencyFormattingOptions = (currencyIsoCode) => {
 return {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
-   style: "currency",
+   style: "currency", // add comment
    currencyDisplay: "code",
    currency: currencyIsoCode
 }
```

```js
const parse = require('parse-patch-hunks')

const patch = fs.readFileSync(patchLocation, 'utf-8')
const parsedPatch = parse(patch)
```

```js
[
    {
        "header": {
            "oldStart": 4303,
            "oldLines": 7,
            "newStart": 4303,
            "newLines": 7
        },
        "context": "const getCurrencyFormattingOptions = (currencyIsoCode) => {",
        "lines": [
            {
                "type": "unchanged",
                "oldIndex": 4303,
                "newIndex": 4303,
                "oldValue": "return {",
                "newValue": "return {"
            },
            {
                "type": "unchanged",
                "oldIndex": 4304,
                "newIndex": 4304,
                "oldValue": "   minimumFractionDigits: 2,",
                "newValue": "   minimumFractionDigits: 2,"
            },
            {
                "type": "unchanged",
                "oldIndex": 4305,
                "newIndex": 4305,
                "oldValue": "   maximumFractionDigits: 2,",
                "newValue": "   maximumFractionDigits: 2,"
            },
            {
                "type": "changed",
                "oldIndex": 4306,
                "newIndex": 4306,
                "oldValue": "   style: \"currency\",",
                "newValue": "   style: \"currency\", // add comment"
            },
            {
                "type": "unchanged",
                "oldIndex": 4307,
                "newIndex": 4307,
                "oldValue": "   currencyDisplay: \"code\",",
                "newValue": "   currencyDisplay: \"code\","
            },
            {
                "type": "unchanged",
                "oldIndex": 4308,
                "newIndex": 4308,
                "oldValue": "   currency: currencyIsoCode",
                "newValue": "   currency: currencyIsoCode"
            },
            {
                "type": "unchanged",
                "oldIndex": 4309,
                "newIndex": 4309,
                "oldValue": "}",
                "newValue": "}"
            }
        ]
    }
]
```

## License

MIT
