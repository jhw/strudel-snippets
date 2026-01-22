//@title Morrow @by Switch Angel

await samples('github:yaxu/clean-breaks/main');
backgroundImage(
  'https://raw.githubusercontent.com/daslyfe/1cassets/main/bunnymebg.png',
  {style: 'background-size:cover'}
);

setCps(172 / 4 / 60);

// FIXME: songProgression pattern was hard to read
const songProgression = "<0@16 1@15 2 3@16 4@16 0@0 5@0 6@15 7 3@16 4@15 7 4@16>";

// FIXME: chords array notation unclear - may use different bracket style
const chords = [
  "eF2, G3, F3, A3, C4, E4+",
  "<G2, D3, G3, B3, E4+",
  "+A2, D3, G3, C4, E4+",
  "+G2, D3, G3, C4, E4+",
  "+C3, G3, C4, D4+",
  "+F2, F3, A3, D4+",
  "+G2, D3, G3, B3, G4+",
  "+A2, E3, A3, C4, D4+",
];

// FIXME: chordProgressions notation unclear
const chordProgressions = [
  "<0@4 1@2 2@2>",
  "<0@4 1@2 +2 3++@2>",
  "<5@4 6@2 7@2 5@4 6@2 +7 0@3+@2>",
];

const arrangedChords = pick(pick(songProgression, chordProgressions), chords);

// It's been 13 years since we stood atop the mountain overlooking the valley

const p1 = "<1@2 1 1>";
const p2 = "{1@5 1@3}%8";
const p1a = 0.01;
const p2a = 0.2;

const curves = [[0,1], [1,0]];

// FIXME: padMod squeeze params were cut off in screenshot
const padMod = squeeze("<0@32 1@16 2@16 0@32 4@16 3@16 2@16>", +"280", saw.rangex(280, 2));
// FIXME: sound notation "+gm_fx_atmosphere+" unclear
const pad = note(arrangedChords)
  .struct(pick(songProgression, [p1, p1, p1, p2, p2, p1]))
  .sound("+gm_fx_atmosphere+")
  .vib(4)
  .vibmod(0.05)
  .attack(pick(songProgression, [p1a, p1a, p1a, p2a, p2a, p1a]))
  .release(0.01)
  .clip(1)
  .lpf(padMod)
  .room(0.6)
  .postgain(padMod.mul(-.00002).add(1)).color("#2B3945");

// FIXME: bell struct pattern uncertain
const bell = "[a3]%1"
  .add(-0.1)
  .note()
  .struct("{[0]@7 [1]}%4")
  .sound("gm_tinkle_bell")
  .adsr([0, 0.1, 0.0, 1])
  .clip(1)
  .gain(0.5)
  .pan(rand)
  .delay(0.5)
  .delaytime(0.6).color('#693d3a');

// FIXME: arp pattern was complex and partially obscured
const arp = note(arrangedChords.add("{12@3 [24 @19]}%4"))
  .arp("{[0 | 3] 1 2 5 4 0 0 7 @4 10 11 10 [6 | 10] @ 7}%[01]")
  .struct("{1}%8")
  .sound(
    "{[sawtooth || triangle || gm_shanai || square || z_lan]}%8:0:.3 , white:0:0.2 ")
  .pan(sine.fast(2))
  .lpf(sine.range(50, 400).slow(16))
  .lpenv(10)
  .lpdecay(0.2)
  .lpsustain(0.1)
  .decay(0.2)
  .release(0.1)
  .delay(0.5).color('#87abb51');

const beatMash = slider(0, 0, 5, 1);
const breakNumCycles = 2;
// FIXME: breakPatterns had overlapping video content, patterns uncertain
const breakPatterns = [
  "{[0 || 3] [1][2][3] [4][5|| 0][6 || 6|2][7 || 0 || 5]}%8",
  "{[5][9 || 5][2][3]}%8",
  "{5 5 3 5}%8",
  "{0}%8",
  "{0}%16",
  "{9}%16",
];

// FIXME: drums speed pattern was cut off
const drums = note(36).sound("riffin")
  .loopAt(breakNumCycles)
  .slice(8 * breakNumCycles, pick(beatMash, breakPatterns))
  .sometimesBy(0.05, x => x.ply("1 2 [2 || 4 1]").speed("< .35@4 - .35}%16"))
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
const ride = "[30]%4"
  .note()
  .sound("RolandTR909_rd")
  .struct(pick("<0 0 0 1>", ["{[1][1][0 1][0]}%4", "{[1]}%4"]))
  .velocity("{[.3][.2]}%4")
  .pan(0.5)
  .cut(13)
  .postgain(0.6);

// FIXME: tomFill sound pattern was truncated
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

// Something that never came back

// FIXME: bassMod squeeze params were cut off
const bassMod = squeeze("<0@48 1@16 2@16 1@32 3@16 2@16 >", +2000, saw.rangex(2000, 80));
// FIXME: bass pattern was partially visible
const bass = "{f1@2 g1@2 [a0 || a1] [a1@5 [g1 || a2 || c2]]@3 }%1"
  .layer((x) => x.add("0, 19, 0.05"))
  .n()
  .struct("{1@6 [0 1@3]@2}%4")
  .sound("sawtooth")
  .lpf(bassMod)
  .adsr([0, 2, 0.1, 0.01])
  .gain(0.5)
  .vib(10)
  .vibmod(0.1)
  .room(1).color('#e59dae');

// FIXME: sections array was partially visible
const sections = [
  bell,
  stack(pad, bell),
  stack(tomFill, pad),
];
