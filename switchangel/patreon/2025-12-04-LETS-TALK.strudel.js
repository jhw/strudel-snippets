//@TITLE Lets Talk @by Switch Angel
// --- Baked register functions from prebake.strudel ---
// tb303 style filter envelope control between 0 & 1 values for useful range
register('acidenv', (x, pat) => pat.lpf(100)
  .lpenv(x * 9).lps(.2).lpd(.12).lpq(2)
)
window.pk = function (...args) {
  const control = args.length > 2 ? args.pop() : 0
  return pick(args, control)
}
// lpf between 0 and 1
register('rlpf', (x, pat) => { return pat.lpf(pure(x).mul(12).pow(4)) })
// --- End baked register functions ---

setCpm(150/4)
const volume = slider(1)
all(x => x.mul(postgain(volume)))

const pkstack = pk(
  "<Am C G Dm>",
  "Dm",
  0
)
$LEAD: n("<0 3 9 4 7>*16".add(-3)).chord(pkstack).voicing().s("pulse").add(note("-4"))
  .pan(rand).pwrate(3).acidenv(slider(0.796)).delay(.7).o(3)
  ._pianoroll()
$BASS: note("<a3 c4 g3 d3 a3 g3 g4 d4>".sub(24).add("<12>*8"))
  .pw(.3).seg(16).s("supersaw")
  .rlpf(.3).acidenv(slider(0.793)).add(note("-4")).o(4)

$KICK: s("sbd!4").duck("3:4").duckdepth(.8)
