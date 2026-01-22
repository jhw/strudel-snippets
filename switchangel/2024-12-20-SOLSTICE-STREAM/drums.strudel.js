//@title bend the horizon (drums) @by Switch Angel

setCps(140/60/4);

const tran = pick(["0", "<0!4 -6 -4 >/2"], 0);

const kick = s("bd:47").struct("x(8,32)".slow(2)).gain(.9);

const noisePat = [
  "{~ @ x@2  x x@2 x }%16",
  "{x x ~ x ~ x x ~ }%16"
];

const basskick = s("sbd:2").note("c2").add(tran).struct("x!4").clip(1)
  .att(0.6).hpf(2).hpenv(13).hpattack(0).hpdecay(.19).orbit(2).postgain(.76);

const shell = s("white, sd:0:6").struct(pick(noisePat, "0"))
  .hpf(600).bpf("300").mul(sine.slow(8).range(0.8, 1.5)).mul("{1@7 1.2}%16")
  .bpenv(sine.slow(10).range(1, 1.8)).bpsustain(0.4)
  .bpdecay(.13).bpq(.46).decay(.13).postgain(2.6).phaser(.2)
  .pan(sine.fast(4)).delay(.8).delayfeedback(0.5).delaytime(3/8);

const hats = note("c3").s("{glitch:4:1.8,white}")
  // .struct("{x!2 ~ x}%16")
  .struct("x!16")
  .decay(saw.fast(4).range(0.05, .15)).begin(tri.range(0.08, 0.3).slow(4));

const ohats = s("oh:17, oh:6:.5").struct("{[0] 1}%8").clip(1);

const clap = s("cp:24:1, sd:26:[<.7 0 > 0], sd:4:0").struct("{~ 1}%4".almostNever(x => x.ply("1")));

const clap2 = note("c2").s("sd:7").struct("x(16,16,2)").clip(1).decay(.2).gain(slider(0, 0, 1));

const goldeneye = s("block:4").struct("<0 0 1 0 0 0 0 0>").postgain(1.3); // `block` appears to be a custom sample

const drums = stack(
  kick,
  hats,
  ohats,
  clap,
  clap2
  // goldeneye
).postgain(.68);

d1: drums.orbit(1);
