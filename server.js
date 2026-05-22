const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SUFFIXES = {
    'k': 1e3,
    'm': 1e6,
    'b': 1e9,
    't': 1e12,
    'qa': 1e15,
    'qi': 1e18,
    'sx': 1e21,
    'sp': 1e24,
    'oc': 1e27,
    'no': 1e30,
    'dc': 1e33,
    'ud': 1e36,
    'dd': 1e39,
    'td': 1e42,
    'qd': 1e45,
    'qd': 1e45,
    'qi': 1e48,
    'si': 1e51,
    'spi': 1e54,
    'oci': 1e57,
    'noi': 1e60,
    'dci': 1e63,
    'udi': 1e66,
    'ddi': 1e69,
    'tdi': 1e72,
    'qdi': 1e75,
    'qii': 1e78,
    'sxi': 1e81,
    'spi': 1e84,
    'oci': 1e87,
    'noi': 1e90,
    'dci': 1e93,
    'uv': 1e96,
    'dv': 1e99,
    'tv': 1e102,
    'qv': 1e105,
    'qiv': 1e108,
    'sxv': 1e111,
    'spv': 1e114,
    'ocv': 1e117,
    'nov': 1e120,
    'dcv': 1e123,
    'uv': 1e126,
    'ddv': 1e129,
    'tdv': 1e132,
    'qdv': 1e135,
    'qiv': 1e138,
    'sxv': 1e141,
    'spv': 1e144,
    'ocv': 1e147,
    'nov': 1e150,
    'dcv': 1e153,
    'ut': 1e156,
    'dt': 1e159,
    'tt': 1e162,
    'qt': 1e165,
    'qit': 1e168,
    'sxt': 1e171,
    'spt': 1e174,
    'oct': 1e177,
    'not': 1e180,
    'dct': 1e183,
    'utr': 1e186,
    'dtr': 1e189,
    'ttr': 1e192,
    'qtr': 1e195,
    'qitr': 1e198,
    'sxtr': 1e201,
    'sptr': 1e204,
    'octr': 1e207,
    'notr': 1e210,
    'dctr': 1e213,
    'uq': 1e216,
    'dq': 1e219,
    'tq': 1e222,
    'qq': 1e225,
    'qiq': 1e228,
    'sxq': 1e231,
    'spq': 1e234,
    'ocq': 1e237,
    'noq': 1e240,
    'dcq': 1e243,
    'uc': 1e246,
    'du': 1e249,
    'tu': 1e252,
    'qu': 1e255,
    'qiu': 1e258,
    'sxu': 1e261
};

function parseNumberWithSuffix(input) {
    if (!input) return null;
    const str = String(input).toLowerCase().trim();
    const match = str.match(/^(\d+(?:\.\d+)?)([a-z]+)?$/i);
    if (!match) return null;
    let value = parseFloat(match[1]);
    let suffix = (match[2] || '').toLowerCase();
    if (isNaN(value)) return null;
    if (suffix && SUFFIXES[suffix]) {
        const result = value * SUFFIXES[suffix];
        if (result > 1e260) return 1e260;
        return result;
    }
    if (value > 1e260) return 1e260;
    return value;
}

function formatNumberWithSuffix(num) {
    if (num === null || num === undefined || isNaN(num)) return "0";
    const absNum = Math.min(Math.abs(num), 1e260);
    const sign = num < 0 ? "-" : "";
    const tiers = [
        { v: 1e258, s: "QiU" }, { v: 1e255, s: "Qu" }, { v: 1e252, s: "Tu" }, { v: 1e249, s: "Du" }, { v: 1e246, s: "Uc" },
        { v: 1e243, s: "DcQ" }, { v: 1e240, s: "NoQ" }, { v: 1e237, s: "OcQ" }, { v: 1e234, s: "SpQ" }, { v: 1e231, s: "SxQ" },
        { v: 1e228, s: "QiQ" }, { v: 1e225, s: "QQ" }, { v: 1e222, s: "TQ" }, { v: 1e219, s: "DQ" }, { v: 1e216, s: "UQ" },
        { v: 1e213, s: "DcTr" }, { v: 1e210, s: "NoTr" }, { v: 1e207, s: "OcTr" }, { v: 1e204, s: "SpTr" }, { v: 1e201, s: "SxTr" },
        { v: 1e198, s: "QiTr" }, { v: 1e195, s: "QTr" }, { v: 1e192, s: "TTr" }, { v: 1e189, s: "DTr" }, { v: 1e186, s: "UTr" },
        { v: 1e183, s: "DcT" }, { v: 1e180, s: "NoT" }, { v: 1e177, s: "OcT" }, { v: 1e174, s: "SpT" }, { v: 1e171, s: "SxT" },
        { v: 1e168, s: "QiT" }, { v: 1e165, s: "QT" }, { v: 1e162, s: "TT" }, { v: 1e159, s: "DT" }, { v: 1e156, s: "UT" },
        { v: 1e153, s: "DcV" }, { v: 1e150, s: "NoV" }, { v: 1e147, s: "OcV" }, { v: 1e144, s: "SpV" }, { v: 1e141, s: "SxV" },
        { v: 1e138, s: "QiV" }, { v: 1e135, s: "QV" }, { v: 1e132, s: "TV" }, { v: 1e129, s: "DV" }, { v: 1e126, s: "UV" },
        { v: 1e123, s: "DcI" }, { v: 1e120, s: "NoI" }, { v: 1e117, s: "OcI" }, { v: 1e114, s: "SpI" }, { v: 1e111, s: "SxI" },
        { v: 1e108, s: "QiI" }, { v: 1e105, s: "QI" }, { v: 1e102, s: "TI" }, { v: 1e99, s: "DI" }, { v: 1e96, s: "UI" },
        { v: 1e93, s: "Dc" }, { v: 1e90, s: "No" }, { v: 1e87, s: "Oc" }, { v: 1e84, s: "Sp" }, { v: 1e81, s: "Sx" },
        { v: 1e78, s: "Qi" }, { v: 1e75, s: "Qa" }, { v: 1e72, s: "T" }, { v: 1e69, s: "B" }, { v: 1e66, s: "M" },
        { v: 1e63, s: "k" }
    ];
    for (const tier of tiers) {
        if (absNum >= tier.v) {
            const formatted = (absNum / tier.v).toFixed(2).replace(/\.?0+$/, '');
            return sign + formatted + tier.s;
        }
    }
    return sign + absNum.toString();
}

app.get("/", (req, res) => {
    res.json({ message: "Numbers Conversion API", version: "3.0", status: "online", max_suffix: "1e258 (QiU)" });
});

app.get("/api/parse", (req, res) => {
    const { input, number } = req.query;
    if (input) {
        const result = parseNumberWithSuffix(input);
        if (result !== null) {
            return res.json({ success: true, result: result, formatted: formatNumberWithSuffix(result) });
        }
        return res.status(400).json({ success: false, error: "Invalid input format" });
    }
    if (number) {
        const num = parseFloat(number);
        if (!isNaN(num)) {
            const limited = Math.min(num, 1e260);
            return res.json({ success: true, result: limited, formatted: formatNumberWithSuffix(limited) });
        }
        return res.status(400).json({ success: false, error: "Invalid number" });
    }
    res.status(400).json({ success: false, error: "Missing input or number parameter" });
});

app.post("/api/parse", (req, res) => {
    const { input, number } = req.body;
    if (input) {
        const result = parseNumberWithSuffix(input);
        if (result !== null) {
            return res.json({ success: true, result: result, formatted: formatNumberWithSuffix(result) });
        }
        return res.status(400).json({ success: false, error: "Invalid input format" });
    }
    if (number !== undefined) {
        const num = parseFloat(number);
        if (!isNaN(num)) {
            const limited = Math.min(num, 1e260);
            return res.json({ success: true, result: limited, formatted: formatNumberWithSuffix(limited) });
        }
        return res.status(400).json({ success: false, error: "Invalid number" });
    }
    res.status(400).json({ success: false, error: "Missing input or number parameter" });
});

app.get("/api/format", (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).json({ success: false, error: "Missing number parameter" });
    }
    const num = parseFloat(number);
    if (isNaN(num)) {
        return res.status(400).json({ success: false, error: "Invalid number" });
    }
    const limited = Math.min(num, 1e260);
    res.json({ success: true, formatted: formatNumberWithSuffix(limited) });
});

module.exports = app;