//@title Morrow (drums) @by Switch Angel

await samples('github:yaxu/clean-breaks/main');

setCps(172 / 4 / 60);

const beatMash = slider(0, 0, 5, 1);
const breakNumCycles = 2;

// FIXME: breakPatterns had overlapping video content, patterns uncertain
const breakPatterns = [
  //"{[0 || 3] [1][2][3] [4][5|| 0][6 || 6|2][7 || 0 || 5]}%8",
  //"{[5][9 || 5][2][3]}%8",
  "{5 5 3 5}%8",
  "{0}%8",
  "{0}%16",
  "{9}%16",
];

// FIXME: drums speed pattern was cut off
const breaks = note(36).sound("riffin")
  .loopAt(breakNumCycles)
  .slice(8 * breakNumCycles, pick(beatMash, breakPatterns))
  //.sometimesBy(0.05, x => x.ply("1 2 [2 || 4 1]").speed("< .35@4 - .35}%16"))
  .cut(1)
  .lpf(12000)
  .room(0.15)
  .hpf(0)
  .postgain(0.75).color('#a2da0B8');

const sdrumMash = pick(beatMash, [
  1,
  0.25,
  "0.5",
  "{0.125}%8",
  "{0.125}%16",
  0,
]);

// FIXME: synthDrums struct patterns uncertain
const synthDrums = stack(
  note(36).sound("RolandSystem100_bd").struct("{[1][0][0 [1]][0]}%4").cut(15),
  note(36).sound("RolandTR707_cp")
    .struct("{[0][1][0][1]}%4")
    .echo(3, 1 / 16, 0.2)
    .velocity(0.6)
    .cut(15)
)
  .sometimesBy(0.05, ply(choose("2", "4")))
  .postgain(0.6)
  .linger(sdrumMash);

const hh = note(36).sound("RolandTR808_hh")
  .struct("{1}%8")
  .sometimesBy(0.05, ply(choose("2", "4")))
  .gain(0.3)
  .linger(sdrumMash).color('#c39626');

// FIXME: ride struct pattern uncertain
/*
const ride = "[30]%4"
  .note()
  .sound("RolandTR909_rd")
  .struct(pick("<0 0 0 1>", ["{[1][1][0 1][0]}%4", "{[1]}%4"]))
  .velocity("{[.3][.2]}%4")
  .pan(0.5)
  .cut(13)
  .postgain(0.6);
  */

// FIXME: tomFill sound pattern was truncated
/*
const tomFill = stack(
  "[g f a2 g f a2 g a2 1]%8"
    .add(12)
    .note()
    .sound("{[gm_melodic_tom:0:1.5]}%8")
    .ply(2)
    .pan("{0 .3 .9}%8")
    .cut(12)
    .gain(2),
  sound(
    "{[AlesisSR16_sd:0:.412] [bd:6:.2, oh:6:.2] bd:6:.2 [AlesisSR16_sd:0:.412] [bd:6: AlesisSR16_sd:0:.4] 1}%8"
  )
).postgain(0.8);
*/

const drums = stack(
  breaks,
  synthDrums,
  hh
  // ride,
  // tomFill,
).postgain(.68);

d1: drums.orbit(1);
