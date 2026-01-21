//@title Sunrise in Ireland @By Switch Angel

$: mondo`;
//melody
$ n <0 3 1 8 9>*8 # add (n <0@2 -3 5>) # scale g:major:pentatonic # s wt_vgame:2 # rel .8 # dec .4;
# lpf  4000 # velocity (rand # rib 0 3 # range 0.7 1) # pan rand # delay .7;

//harmony
$ n <0 3 1 8 9>*8 # add (n 2) # scale g:major:pentatonic # s wt_vgame:6  # rel .8 # dec .4;
# lpf  4000 # velocity (rand # rib 3 4 # range 0.7 1) # pan (rand # fast 4) # delay .7;
# late (rand # range -.01 .01);

//piano
$ s piano # note g1 # slow 4;
`._pianoroll();


