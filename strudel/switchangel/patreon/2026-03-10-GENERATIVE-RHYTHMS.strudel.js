// https://www.patreon.com/posts/strudel-micro-2-152658733

$: s("hh:3 hh hh hh");
const density = slider(0.5).mul(2);
const perl = slider(0.5).mul(16);
$: s("bd:1").struct(perlin.fast(perl).mul(density).seg(16).round().rib("<0 0 0 32>", 1))._pianoroll();
