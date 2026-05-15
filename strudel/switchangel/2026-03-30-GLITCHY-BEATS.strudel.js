// https://www.patreon.com/posts/strudel-micro-4-154289058

setCpm(140/4);

$: s("bd").seg(8)
    .sometimesBy(.3, ply("2 | 3")).ribbon(5, 1)
    .cut(1).hpf(200)
    .n(irand(15).ribbon(76, .5)).bank("Rolandmc303").o(3)
    .delay(rand).room(.1)
    .crush(6).dec(rand);

$: s("bd:1!4").duck(3);

$: s("<- oh:2>*8").gain(.7);
