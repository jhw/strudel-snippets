// @Title Patron Beat 25.12.18 @By Everyone
// --- Baked register functions from prebake.strudel ---
//stext
//transform text input into synthesis!
register('stxt', (text, pat) => {
  const RANGE = 'range';
  const SELECTION = 'selection';

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
  const byteArray = Array.from(utf8Bytes);


  const byteSize = 255;
  let acc = 0;
  Object.keys(params).forEach((p, i) => {
    const { type, transform = (x) => x, val } = params[p];

    let byteVal = byteArray[i % byteArray.length];
    acc += byteVal;
    byteVal = [byteVal + acc] % byteSize;

    if (type === SELECTION) {

      pat = pat[p](transform(val[byteVal % val.length]));


    } else {
      const min = val.at(0);
      const max = val.at(-1);
      const pTotal = max - min;
      const valAdjusted = ((pTotal / byteSize) * byteVal) + min;

      pat = pat[p](transform(valAdjusted));

    }
  })

  return pat
});
// --- End baked register functions ---

setCpm(140/4);
const volume = slider(0.667);


const patrons = `;
<Dillon_Summers Be_Ankh_Ah Hailey_Halcyon recursive;
Charlie_Juno_Jr Janeishly Daft Rick_Wells>*16;
`;
$PATRON_BASS: s("sawtooth!16")
  .stxt(patrons).att(0)
  .scale("e:major:pentatonic");
  // .diode("4:.3")
  // .punchcard({labels: 1})
  // .label(patrons)

$KICK: s("sbd!4");

HAT$: s(" <- oh:2>*8")
  .dec(.3).delay(.5).o(5).delaytime(1/8);

