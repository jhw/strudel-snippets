window.DX = (donk = .8) => {
    donk = reify(donk);
    return s("sine").fm(donk.mul(6)).fmdec(.2);
};

$BASS: n("<0 - - 0 - 8 7 9>*16").scale("g1:phrygian")
    .set(DX("<.5 .3 .3 .6>*16"));

$: s("sbd!4");
