// https://www.patreon.com/posts/153706620

samples('github:switchangel/breaks');
setCpm(165/4);

$: s("breaks").n("<0 0 0 3>").slow(2).fit().scrub(irand(16).div(16).seg(8))._scope();

// .almostNever(x => x.ply("2 | 4").delay(0.7));
