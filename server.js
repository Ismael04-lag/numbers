// api/format.js — Hedgehog Bank Number Formatter
// Deploy on Vercel, then call:
//   GET /api/format?n=1000000000000000000000000000000000000000000000000000
//   GET /api/format?n=200000000000000&suffix=true
//   POST /api/format  { "numbers": ["1000000", "2qt", "500k"] }

const TIERS = [
  { v: "1" + "0".repeat(258), s: "Qiu" },
  { v: "1" + "0".repeat(255), s: "Qu"  },
  { v: "1" + "0".repeat(252), s: "Tu"  },
  { v: "1" + "0".repeat(249), s: "Du"  },
  { v: "1" + "0".repeat(246), s: "Uc"  },
  { v: "1" + "0".repeat(243), s: "DcQ" },
  { v: "1" + "0".repeat(240), s: "NoQ" },
  { v: "1" + "0".repeat(237), s: "OcQ" },
  { v: "1" + "0".repeat(234), s: "SpQ" },
  { v: "1" + "0".repeat(231), s: "SxQ" },
  { v: "1" + "0".repeat(228), s: "QiQ" },
  { v: "1" + "0".repeat(225), s: "QQ"  },
  { v: "1" + "0".repeat(222), s: "TQ"  },
  { v: "1" + "0".repeat(219), s: "DQ"  },
  { v: "1" + "0".repeat(216), s: "UQ"  },
  { v: "1" + "0".repeat(213), s: "DcTr"},
  { v: "1" + "0".repeat(210), s: "NoTr"},
  { v: "1" + "0".repeat(207), s: "OcTr"},
  { v: "1" + "0".repeat(204), s: "SpTr"},
  { v: "1" + "0".repeat(201), s: "SxTr"},
  { v: "1" + "0".repeat(198), s: "QiTr"},
  { v: "1" + "0".repeat(195), s: "QTr" },
  { v: "1" + "0".repeat(192), s: "TTr" },
  { v: "1" + "0".repeat(189), s: "DTr" },
  { v: "1" + "0".repeat(186), s: "UTr" },
  { v: "1" + "0".repeat(183), s: "DcT" },
  { v: "1" + "0".repeat(180), s: "NoT" },
  { v: "1" + "0".repeat(177), s: "OcT" },
  { v: "1" + "0".repeat(174), s: "SpT" },
  { v: "1" + "0".repeat(171), s: "SxT" },
  { v: "1" + "0".repeat(168), s: "QiT" },
  { v: "1" + "0".repeat(165), s: "QT"  },
  { v: "1" + "0".repeat(162), s: "TT"  },
  { v: "1" + "0".repeat(159), s: "DT"  },
  { v: "1" + "0".repeat(156), s: "UT"  },
  { v: "1" + "0".repeat(153), s: "DcV" },
  { v: "1" + "0".repeat(150), s: "NoV" },
  { v: "1" + "0".repeat(147), s: "OcV" },
  { v: "1" + "0".repeat(144), s: "SpV" },
  { v: "1" + "0".repeat(141), s: "SxV" },
  { v: "1" + "0".repeat(138), s: "QiV" },
  { v: "1" + "0".repeat(135), s: "QV"  },
  { v: "1" + "0".repeat(132), s: "TV"  },
  { v: "1" + "0".repeat(129), s: "DV"  },
  { v: "1" + "0".repeat(126), s: "UV"  },
  { v: "1" + "0".repeat(123), s: "DcI" },
  { v: "1" + "0".repeat(120), s: "NoI" },
  { v: "1" + "0".repeat(117), s: "OcI" },
  { v: "1" + "0".repeat(114), s: "SpI" },
  { v: "1" + "0".repeat(111), s: "SxI" },
  { v: "1" + "0".repeat(108), s: "QiI" },
  { v: "1" + "0".repeat(105), s: "QI"  },
  { v: "1" + "0".repeat(102), s: "TI"  },
  { v: "1" + "0".repeat(99),  s: "DI"  },
  { v: "1" + "0".repeat(96),  s: "UI"  },
  { v: "1" + "0".repeat(93),  s: "DcN" },
  { v: "1" + "0".repeat(90),  s: "NoN" },
  { v: "1" + "0".repeat(87),  s: "OcN" },
  { v: "1" + "0".repeat(84),  s: "SpN" },
  { v: "1" + "0".repeat(81),  s: "SxN" },
  { v: "1" + "0".repeat(78),  s: "QiN" },
  { v: "1" + "0".repeat(75),  s: "QaN" },
  { v: "1" + "0".repeat(72),  s: "TN"  },
  { v: "1" + "0".repeat(69),  s: "BN"  },
  { v: "1" + "0".repeat(66),  s: "MN"  },
  { v: "1" + "0".repeat(63),  s: "kN"  },
  // ── Paliers manquants (10^60 → 10^6) ──
  { v: "1" + "0".repeat(60),  s: "NoDc"},
  { v: "1" + "0".repeat(57),  s: "OcDc"},
  { v: "1" + "0".repeat(54),  s: "SpDc"},
  { v: "1" + "0".repeat(51),  s: "Qt"  },
  { v: "1" + "0".repeat(48),  s: "Qo"  },
  { v: "1" + "0".repeat(45),  s: "Qs"  },
  { v: "1" + "0".repeat(42),  s: "Dz"  },
  { v: "1" + "0".repeat(39),  s: "Dq"  },
  { v: "1" + "0".repeat(36),  s: "Ud"  },
  { v: "1" + "0".repeat(33),  s: "De"  },
  { v: "1" + "0".repeat(30),  s: "Non" },
  { v: "1" + "0".repeat(27),  s: "Oct" },
  { v: "1" + "0".repeat(24),  s: "Sep" },
  { v: "1" + "0".repeat(21),  s: "Sxt" },
  { v: "1" + "0".repeat(18),  s: "Qin" },
  { v: "1" + "0".repeat(15),  s: "Qd"  },
  { v: "1" + "0".repeat(12),  s: "Tr"  },
  { v: "1" + "0".repeat(9),   s: "Md"  },
  { v: "1" + "0".repeat(6),   s: "M"   },
  { v: "1" + "0".repeat(3),   s: "k"   },
].map(t => ({ v: BigInt(t.v), s: t.s }));

function toBigInt(v) {
  if (typeof v === "bigint") return v;
  if (v === undefined || v === null) return 0n;
  try {
    const clean = String(v).split(".")[0].replace(/[^0-9\-]/g, "") || "0";
    return BigInt(clean);
  } catch { return 0n; }
}

function formatNumber(num) {
  const big = toBigInt(num);
  if (big < 0n) return "-" + formatNumber(-big);
  if (big === 0n) return "0";
  if (big > 10n ** 260n) return "∞";

  for (const tier of TIERS) {
    if (big >= tier.v) {
      const intPart = big / tier.v;
      const remainder = big % tier.v;
      const decPart = (remainder * 100n) / tier.v;
      if (decPart > 0n) {
        const dec = Number(decPart).toString().padStart(2, "0").slice(0, 2).replace(/0+$/, "");
        if (dec === "") return `${intPart}${tier.s}`;
        return `${intPart}.${dec}${tier.s}`;
      }
      return `${intPart}${tier.s}`;
    }
  }
  // < 1000 → séparation par espaces pour lisibilité
  return big.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ── Parse "2qt", "500k", "1.5M" etc. → BigInt ──
const SFX_MAP = {
  k:   1_000n,
  m:   1_000_000n,
  md:  1_000_000_000n,
  b:   1_000_000_000n,
  tr:  1_000_000_000_000n,
  qd:  10n**15n,
  qin: 10n**18n,
  sxt: 10n**21n,
  sep: 10n**24n,
  oct: 10n**27n,
  non: 10n**30n,
  de:  10n**33n,
  ud:  10n**36n,
  dq:  10n**39n,
  dz:  10n**42n,
  qs:  10n**45n,
  qo:  10n**48n,
  qt:  10n**51n,
  nodc:10n**60n,
  ocdc:10n**57n,
  spdc:10n**54n,
  kn:  10n**63n,
  mn:  10n**66n,
  bn:  10n**69n,
  tn:  10n**72n,
  qa:  10n**75n,
  qi:  10n**78n,
  sx:  10n**81n,
  sp:  10n**84n,
  oc:  10n**87n,
  no:  10n**90n,
  dc:  10n**93n,
};

function parseAmount(input) {
  if (!input) return 0n;
  const str = String(input).toLowerCase().trim();
  const match = str.match(/^(-?\d+(?:\.\d+)?)([a-z]+)?$/i);
  if (!match) return 0n;
  const val = parseFloat(match[1]);
  const sfx = (match[2] || "").toLowerCase();
  if (isNaN(val)) return 0n;
  const base = BigInt(Math.floor(Math.abs(val)));
  const neg = val < 0;
  if (!sfx) return neg ? -base : base;
  const mult = SFX_MAP[sfx];
  if (mult) return neg ? -(base * mult) : base * mult;
  return neg ? -base : base;
}

// ── CORS helper ──
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // ── POST: batch convert ──
    if (req.method === "POST") {
      const body = req.body || {};
      const numbers = Array.isArray(body.numbers) ? body.numbers : [];
      if (numbers.length === 0) {
        return res.status(400).json({ success: false, error: "Provide a 'numbers' array in the body." });
      }
      if (numbers.length > 100) {
        return res.status(400).json({ success: false, error: "Max 100 numbers per request." });
      }
      const results = numbers.map(n => {
        const big = typeof n === "string" && /[a-zA-Z]/.test(n) ? parseAmount(n) : toBigInt(n);
        return { input: n, formatted: formatNumber(big), raw: big.toString() };
      });
      return res.status(200).json({ success: true, results });
    }

    // ── GET: single convert ──
    if (req.method === "GET") {
      const { n } = req.query;
      if (!n) {
        return res.status(400).json({
          success: false,
          error: "Missing query param ?n=<number>",
          example: "/api/format?n=1000000000000000000000000000000000000000000000000000"
        });
      }
      const big = /[a-zA-Z]/.test(n) ? parseAmount(n) : toBigInt(n);
      return res.status(200).json({
        success: true,
        input: n,
        formatted: formatNumber(big),
        raw: big.toString()
      });
    }

    return res.status(405).json({ success: false, error: "Method not allowed." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
