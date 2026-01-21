//@title DID I MAKE THIS? OR IS XFER GOING TO SUE ME //@by SWITCH ANGEL..possibly
// --- Baked register functions from prebake.strudel ---
// tb303 style filter envelope control between 0 & 1 values for useful range
register('acidenv', (x, pat) => pat.lpf(100)
  .lpenv(x * 9).lps(.2).lpd(.12).lpq(2)
)
register('fmtime', (start,length, pat) => {
  let modu = time.mod(length).add(start)
  return pat.fm(modu).fmh(modu)
})
// lpf between 0 and 1
register('rlpf', (x, pat) => { return pat.lpf(pure(x).mul(12).pow(4)) })
// --- End baked register functions ---

setCpm(138/4)

const volume = slider(0.853)
all(x => x.mul(postgain(volume)))

$BASS: note(`
  <B@4 B@4 B@4 B@4 B@4 B@4 c#4@4 d4@2
   G3@6 G3@4 G3@4 G3@4 G3@4 G3@6
   A@4 E@6 E@4 E@4 E@4 E@4 E@6 F#3@4
   G3@6 G3@4 G3@4 G3@4 G3@4 G3@4 G3@2 G3@6
   >*16`
   .sub(24)
)
.s("wt_digital:0,sawtooth").unison(4).detune(.4)
  .diode("2.5:.34")
  .trans("12,0").wt(.4).warp(.5).warpmode(2)
  .rlpf(slider(1))
  .o(3)
  ._pianoroll()

$LEAD: n("<2 3 6 7 10 <13!6 14 10>>*16").scale("b:minor").s("sawtooth")
.acidenv(slider(0.636)).pan(rand).delay(.7).o(4).room(1)


$TOP: s("<hh:4!2 oh:2 hh:3>*16").acidenv(.7).lpq(0).lpd(.08)

$KICK: s("sbd!4").duck("3:4:5").dec(.3).duckdepth(.6).duckattack(.16).diode(1)
  // .beat("0,4,8,11,14",16)

_$RISER: s("pulse!16").dec(tri.fast(4).range(0.05,.1)).gain(.6).fmtime(16,64)