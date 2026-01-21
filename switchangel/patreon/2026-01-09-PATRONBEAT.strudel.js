//@title Patron Beat 26.1.9 @By Everyone
// --- Baked register functions from prebake.strudel ---
// fill in gaps between events
register('fill', function (pat) {
  return new Pattern(function (state) {
    const lookbothways = 1;
    // Expand the query window
    const haps = pat.query(state.withSpan(span => new TimeSpan(span.begin.sub(lookbothways), span.end.add(lookbothways))));
    const onsets = haps.map(hap => hap.whole.begin)
      // sort fractions
      .sort((a, b) => a.compare(b))
      // make unique
      .filter((x, i, arr) => i == (arr.length - 1) || x.ne(arr[i + 1]));
    const newHaps = [];
    for (const hap of haps) {
      // Ingore if the part starts after the original query
      if (hap.part.begin.gte(state.span.end)) {
        continue;
      }

      // Find the next onset, to use as an offset
      const next = onsets.find(onset => onset.gte(hap.whole.end));

      // Ignore if the part ended before the original query, and hasn't expanded inside
      if (next.lte(state.span.begin)) {
        continue;
      }

      const whole = new TimeSpan(hap.whole.begin, next);
      // Constrain part to original query
      const part = new TimeSpan(hap.part.begin.max(state.span.begin), next.min(state.span.end));
      newHaps.push(new Hap(whole, part, hap.value, hap.context, hap.stateful));
    }
    return newHaps;
  });
})
// tb303 style filter envelope control between 0 & 1 values for useful range
register('acidenv', (x, pat) => pat.lpf(100)
  .lpenv(x * 9).lps(.2).lpd(.12).lpq(2)
)
// lpf between 0 and 1
register('rlpf', (x, pat) => { return pat.lpf(pure(x).mul(12).pow(4)) })
//stext
//transform text input into synthesis!
register('stxt', (text, pat) => {
  const RANGE = 'range'
  const SELECTION = 'selection'

  const params = {
    lpf: {
      type: RANGE,
      val: [100, 3000]
    },
    room: {
      type: RANGE,
      val: [0, 1]
    },
    vib: {
      type: RANGE,
      val: [0, 16]
    },
    vibmod: {
      type: RANGE,
      val: [0, .3]
    },
    wt: {
      type: RANGE,
      val: [0, 1]
    },
    note: {
      type: RANGE,
      transform: x => Math.round(x),
      val: [-12, 8]
    },

    wtrate: {
      type: RANGE,
      val: [0, 3]
    },
    wtdepth: {
      type: RANGE,
      val: [0, 1]
    },

    delay: {
      type: RANGE,
      val: [0, 1]
    },


    delaytime: {
      type: RANGE,
      val: [0, .66]
    },


    delayfeedback: {
      type: RANGE,
      val: [0, .6]
    },

    decay: {
      type: RANGE,
      val: [.1, 1]
    },

    attack: {
      type: RANGE,
      val: [0, .1]
    },

    wtrate: {
      type: RANGE,
      val: [0, 5]
    },

    lpenv: {
      type: RANGE,
      val: [0, 8]
    },

    lpd: {
      type: RANGE,
      val: [0, 1]
    },

    lpa: {
      type: RANGE,
      val: [0, .5]
    },

    detune: {
      type: RANGE,
      val: [0, .8]
    },



    // penv: {
    //   type: RANGE,
    //   transform: x => Math.round(x),
    //   val: [0, 48]
    // },
    // pdec: {
    //   type: RANGE,
    //   val: [0, .1]
    // },


    s: {
      type: SELECTION,
      val: [
        'sawtooth',
        'supersaw',
        'wt_digital',
        'wt_digital_bad_day',
        'wt_digital_basique',
        'wt_digital_echoes',
        'sine',
        'triangle',
        'pulse'
      ]
    }
  };
  // Encode the text into a Uint8Array of UTF-8 bytes
  const encoder = new TextEncoder('utf-8');
  const utf8Bytes = encoder.encode(text);

  // Convert each byte to a two-digit hexadecimal string and join them
  const byteArray = Array.from(utf8Bytes)


  const byteSize = 255
  let acc = 0
  Object.keys(params).forEach((p, i) => {
    const { type, transform = (x) => x, val } = params[p]

    let byteVal = byteArray[i % byteArray.length];
    acc += byteVal
    byteVal = [byteVal + acc] % byteSize

    if (type === SELECTION) {

      pat = pat[p](transform(val[byteVal % val.length]))


    } else {
      const min = val.at(0)
      const max = val.at(-1)
      const pTotal = max - min
      const valAdjusted = ((pTotal / byteSize) * byteVal) + min

      pat = pat[p](transform(valAdjusted))

    }
  })

  return pat
})
register('trancegate', (density, seed, length, x) => {
  return x.struct(rand.mul(density).round().seg(16).rib(seed, length)).fill().clip(.7)
})
// --- End baked register functions ---

register('colorparty', (p, pat) => {
  const hue = Math.floor(p * 360 );
  const color = 'hsl(' + hue + ', 100%, 50%)';
  return pat.color(color);
});


const angel = [
  "Aaron",  "adorfer",  "AdrianW",
  "Barry",  "calcuku",  "Daniel Paradis",
  "Eleanor Lamb",  "Emma Perry",  "Fred",
  "Fred Hicks",  "Ghost of Michael Masi",  "Henry",
  "Jake ",  "jangxx",  "Jose_D_S",
  "Joshua A.C. Newman",  "jslee",  "Jussi Mäki",
  "Kiterati99",  "Kristian Dorland",  "matt",
  "Matthew Robinson",  "Constantnoise",  "Pc-chan",
  "pi",  "recursive",  "Richard Langis",
  "rob dennis",  "Russell Royer",  "Sam Cave",
  "Sam Raredon",  "Scott",  "SecretKea",
  "Sid_Cypher ",  "Somedudeontheweb",  "Stephen Duane",
  "Tom Burke",  "Vilirio ",  "WilliW",
  "Your Old Friend Dan"
];



const agent_of_the_realm = [
  "Andy Cowley",  "arden",  "Asterión",
  "Axel Großklaus",  "Be-Ankh-Ah",  "Benjamin Nolan",
  "blackshfit",  "Boele Kuipers",  "Bryan Sarpad",
  "Can Akin",  "Carlos Goma",  "ccb-somany",
  "Chango",  "Charlie Juno Jr",  "Christopher Embrey",
  "Christopher Emmick",  "Christopher Kight",  "Chronolithe",
  "Claire Mason",  "Daft",  "David Baghurst",
  "David Katz",  "Delaney",  "Der Dackel",
  "Pigeon",
  "Dillon Summers",  "Dominic Talbot",  "Douglas ",
  "Ebike Builder",  "Emily Swift",  "Esk",
  "Esk",  "fluxstorm0",  "Galen Evan Kowalski Buttitta",
  "Grey",  "hackbyte ",  "Hailey Halcyon",
  "Hazel Quantock",  "Innes Reid",  "james schaefer",
  "Janeishly",  "Jason Whitlark",  "Jay Cuthrell",
  "Jessica Canady",  "John Björk",  "Joseph Crail",
  "Karhu",  "Keleko",  "Kenan Bgn",
  "KGE003",  "Kieren Martin",  "Killian Grant",
  "koh501",  "Kumlekar",  "Lance",
  "Lee Nuckols",  "LetsGoRosco",  "Lex Murden",
  "Marcus",  "mauricio gonzalez de la fuente",  "MemeMasterJamers",
  "Meteren",  "nar",  "Nohus",
  "patchrick",  "phobonym",  "Puppy Of Argon",
  "Renzo Tavanti",  "Rey",  "Rick Wells",
  "Sage",  "Saggi Malachi",  "Scott Hanes",
  "Skjalm Arrøe",  "Snoooder",  "Sofia Razón",
  "Terrence Zhang",  "ThomasF",  "Varg",
  "Vincent Brakshoofden",  "William Lamy",  "Windy the Deer",
  "Zimi"
];
const le = agent_of_the_realm.length
const le2 = angel.length
$AGENTS_LEAD: s("sawtooth!8")
  .stxt(pick(agent_of_the_realm,  time.fast(8).mod(le))).att(0).fast(2)
  .scale("e:major:pentatonic").att(0).lpa(0).room(.7)
  .acidenv(slider(0.773)).lpd(.7)
  .delaytime(3/16).delay(.5).pan(rand).colorparty(rand).o(3).gain(.7)
  ._pianoroll()


$ANGEL_HARMONY: s("sawtooth!8").pan(rand.fast(2))
  .stxt(pick(angel,  time.fast(8).mod(le2))).att(0)
  .scale("e:major:pentatonic").att(.1).lpa(0).room(.7)
  .acidenv(slider(0.509)).lpd(.7)
  .delaytime(3/16).delay(.5).o(2).gain(.7)
  ._scope()

$KICK: s("bd:2!4").duck("2:3")

$CLAP: s("<- cp>*4").gain(.6)

$NOISEBURST: s("white").dec(.2)
  .trancegate(1.3,23,1).gain(.5)
  .pan(rand.fast(7)).delay(1).rlpf(rand.fast(7).rib(0,1))


$BASS: note("e2!16".add("<-3 0 <-7 2>@2>/2"))
  .s("supersaw!8").acidenv(slider(0.767))


