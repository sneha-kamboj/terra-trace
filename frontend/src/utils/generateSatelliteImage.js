const SIZE = 512;

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintForestTexture(ctx, rng, { baseHue, patchCount, clearedFraction, clearedSeedPoints }) {
  ctx.fillStyle = `hsl(${baseHue}, 38%, 14%)`;
  ctx.fillRect(0, 0, SIZE, SIZE);


  for (let i = 0; i < 3200; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const r = 1.5 + rng() * 3.5;
    const light = 22 + rng() * 20;
    const hue = baseHue + (rng() * 14 - 7);
    ctx.fillStyle = `hsl(${hue}, ${40 + rng() * 15}%, ${light}%)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "hsla(200, 40%, 55%, 0.15)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.15);
  ctx.bezierCurveTo(SIZE * 0.3, SIZE * 0.35, SIZE * 0.6, SIZE * 0.1, SIZE, SIZE * 0.3);
  ctx.stroke();

  const clearedMaskPoints = [];
  clearedSeedPoints.forEach(({ cx, cy, scale }) => {
    const patches = Math.floor(patchCount * scale);
    for (let i = 0; i < patches; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * 70 * scale;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const r = 4 + rng() * 10;
      ctx.fillStyle = `hsl(${28 + rng() * 12}, ${45 + rng() * 15}%, ${38 + rng() * 12}%)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      clearedMaskPoints.push({ x, y, r: r + 3 });
    }
  });

  return clearedMaskPoints;
}


export function generateScenario({ seed = 1, clearedPercent = 0 }) {
  const rng = mulberry32(seed);
  const baseHue = 118 + Math.floor(rng() * 10);

  const before = document.createElement("canvas");
  before.width = SIZE;
  before.height = SIZE;
  const beforeCtx = before.getContext("2d");
  paintForestTexture(beforeCtx, mulberry32(seed), {
    baseHue,
    patchCount: 8,
    clearedSeedPoints: [{ cx: SIZE * 0.5, cy: SIZE * 0.5, scale: 0.3 }],
  });

  const clearedSeedPoints =
    clearedPercent > 0
      ? [
          { cx: SIZE * 0.35, cy: SIZE * 0.4, scale: clearedPercent / 8 },
          { cx: SIZE * 0.62, cy: SIZE * 0.58, scale: clearedPercent / 11 },
        ]
      : [];

  const after = document.createElement("canvas");
  after.width = SIZE;
  after.height = SIZE;
  const afterCtx = after.getContext("2d");
  const maskPoints = paintForestTexture(afterCtx, mulberry32(seed), {
    baseHue,
    patchCount: Math.round(clearedPercent * 6),
    clearedSeedPoints,
  });

  const mask = document.createElement("canvas");
  mask.width = SIZE;
  mask.height = SIZE;
  const maskCtx = mask.getContext("2d");
  maskCtx.fillStyle = "#000000";
  maskCtx.fillRect(0, 0, SIZE, SIZE);
  maskCtx.fillStyle = "#5FBE84";
  maskPoints.forEach(({ x, y, r }) => {
    maskCtx.beginPath();
    maskCtx.arc(x, y, r, 0, Math.PI * 2);
    maskCtx.fill();
  });

  return {
    beforeUrl: before.toDataURL("image/png"),
    afterUrl: after.toDataURL("image/png"),
    maskUrl: mask.toDataURL("image/png"),
  };
}
