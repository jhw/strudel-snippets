//https://www.youtube.com/watch?v=2kzjOIsL6CM
//@title bend the horizon @by Switch Angel
createParams('outgain');

register('grab', function (scale, pat) {
    // Supports ':' list syntax in mininotation
    scale = (Array.isArray(scale) ? scale.flat() : [scale]).flatMap((val) =>
        typeof val === 'number' ? val : noteToMidi(val) - 48
    );
    
    return pat.withHap((hap) => {
        const isObject = typeof hap.value === 'object';
        let note = isObject ? hap.value.n : hap.value;
        if (typeof note === 'number') {
            note = note;
        }
        if (typeof note === 'string') {
            note = noteToMidi(note);
        }
        
        if (isObject) {
            delete hap.value.n; // remove n so it won't cause trouble
        }
        const octave = (note / 12) >> 0;
        const transpose = octave * 12;
        
        const goal = note - transpose;
        note =
            scale.reduce((prev, curr) => {
                return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
            }) + transpose;
        
        return hap.withValue(() => (isObject ? {...hap.value, note} : note));
    });
});

setCps(140/60/4);

const tran = pick(["0","<0!4 -6 -4 >/2"],0);
const acid = note("e2").add("{0@5 1 -12 0@9}%16".ribbon(0.5, 1)
                            // .sub(12)
                           ).add(tran).grab("e:f:f#:g:a:b:c:d"
                                           )
      .struct("{x@2 x x@2 x!11}%16".ribbon(0.5, 1))
      .s("tear:0:.5").clip(.9).lpf(80)
      .lpenv(slider(4.184,0,8).mul(sine.range(0.8, 1.2).segment(16).slow(18)))
      .lpsustain(.4).lpd(.37).lpq(.7).begin(saw)
      .hpf(200)
      .distort("3:.8").delay(.5).orbit(2).postgain(.8);

const kick = s("bd:47").struct("x(8,32)".slow(2)).gain(.9);

const noisePat = [
    "{~ @ x@2  x x@2 x }%16",
    "{x x x ~ x x ~ x ~}%16"
];

const basskick = s("sbd:8").note("c2".add(tran)).struct("@!4").clip(1)
      .att(0.6).hpf(2).hpenv(13).hpattack(0).hpdecay(.19).orbit(2).postgain(.76);

const shell = s("white, sd:0:6").struct(pick(noisePat, "@7"))
      .hpf(600).bpf("300").mul(sine.slow(8).range(0.8, 1.5)).mul("{1@7 1.2}%16")
      .bpenv(sine.slow(10).range(1, 1.8)).bpsustain(0.4)
      .bpdecay(.13).bpq(.46).decay(.13).postgain(2.6).phaser(.2)
      .pan(sine.fast(4)).delay(.8).delayfeedback(0.5).delaytime(3/8);

const hats = note("c3").s("glitch:0:1.8,white")
// .struct("{x!2 ~ x}%16")
      .struct("x!16")
      .decay(saw.fast(4).range(0.05, .15)).begin(tri.range(0.08, 0.3).slow(4));
const ohats = s("oh:17, oh:6:.5").struct("([0] 1)%8").clip(1);
const clap = s("cp:24:1, sd:26:[<.7 0 > 0], sd:4:0").struct("(~ 1)%4".almostNever(x => x.ply("1")));
const clap2 = note("c2").s("sd:7").struct("x(16,16,2)").clip(1).decay(.2).gain(slider(0,0,1));

const chords = [
    "[E3, B3, F#5, G5]",
];

const arp = note(chords[0]).arp("{0 1 2 3 2 0}%16")
// .add("{0@3 4@3 7@3 0}%16")
      .add(tran.mul(1))
// .add("{7 0 -4 3 0 12}%16").add("4")
      .mul(sine.range(1,1).fast(1.2))
      .grab("e:b:g:a:c:d:f#").room(1).z1(".5:3")
// .add(note("0 0 -3 -5 0 12"))
// note("{0 3 <20!16 18!16>}%16".add(48).grab("e:b:g:f#"))
      .s("pulse:.3").lpf(300).lpenv("4").lpd(.3).lpq(.2).release(.5)
      .pan(sine.fast(4))
      .chorus(.5)
      .distort("3:.4").hpf(100).postgain(.8);

const goldeneye = s("block:4").struct("<0 0 1 0 0 0 0 0>").postgain(1.3);
const chordarp = note("<g3 g2>/4").s("morrow").begin(saw.segment(16).range(.2, .34).slow(.5))
      .clip(.8)
      .struct("x(11,16)").chorus(.5).coarse(12)
      .segment(16).postgain(.8).pan(rand);

const hypelead = note("([f#] g a [[d e] | e] [~ | g] [f#] [[a g] | g | [g f#]] d4)%8")
      .add(12).add(tran).grab("e:b:g:a:c:d:f#")
      .s("tear").begin(rand.range(0,0.3)).clip(.6).delay(.7).delay(.7).delaytime(0.183)
      .postgain(.61).shimmer(.7).room(1).phaser(.5).roomsize(.9).gain("([.9 | .7] [0 0.7 1])%8");

const drums = stack(
    kick,
    hats,
    ohats,
    clap,
    // clap2,
    goldeneye
).postgain(.68);

d1: drums.orbit(1);
d2: basskick.orbit(2);
d3: acid.orbit(3);
// d4: hypelead.orbit(4);
d5: shell.orbit(5);
d6: arp.orbit(6).roomsize(slider(0.989,0,1));
d7: chordarp.orbit(6);

all(x => x.outgain(1));
