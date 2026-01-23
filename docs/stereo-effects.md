# Creating Stereo Effects in Strudel

Strudel's synthesis engine (superdough) generates **mono events** by default. Unlike hardware units like Dirtywave M8's MFX/Chorus or Elektron Octatrack's Chorus/Spatializer, effects like `chorus()` don't automatically create stereo width from a mono source.

To achieve stereo spread, you need to explicitly use stereo-creating functions **before** or **instead of** traditional effects.

## The Problem

```javascript
// This stays mono - chorus modulates but doesn't create stereo
note("a1").s("sawtooth").chorus(0.5)
```

## Solutions

### 1. juxBy - Stereo Processing (Recommended)

`juxBy` applies a function to one channel only, creating stereo difference. Width ranges from 0 (mono) to 1 (full stereo).

```javascript
// Stereo chorus effect - detune right channel slightly
note("a1 e2 a1 g1").s("sawtooth")
  .juxBy(0.5, x => x.detune(8))
  .lpf(500)

// Stereo with pitch shift (like M8 chorus)
note("a1").s("sawtooth")
  .juxBy(0.4, x => x.detune(6).delay(0.01))

// Stereo reverb - different reverb per channel
note("c3 e3 g3").s("piano")
  .juxBy(0.6, x => x.rev().delay(0.02))
```

### 2. Pan Modulation - Spatializer Style

Use LFO on pan to create movement like Octatrack's spatializer.

```javascript
// Auto-pan (spatializer effect)
note("a1 e2").s("sawtooth")
  .pan(sine.range(0.2, 0.8).slow(2))

// Random pan per event (spatial scatter)
note("a1 e2 a1 g1").s("sawtooth")
  .pan(rand)

// Alternating left/right
note("a1 e2 a1 g1").s("sawtooth")
  .pan("<0.2 0.8>")
```

### 3. Layering with Detune - Classic Chorus

Layer the same sound with slight pitch differences and pan them apart.

```javascript
// Dual oscillator chorus
note("a1 e2 a1 g1")
  .add(note("0, 0.08"))  // add slightly detuned layer
  .s("sawtooth")
  .pan("<0.3 0.7>")      // spread layers in stereo

// Triple layer (thicker chorus)
note("a1")
  .add(note("0, -0.05, 0.05"))
  .s("sawtooth")
```

### 4. Stack with Pan - Full Control

Use `stack()` to create separate voices with independent panning.

```javascript
// M8-style stereo chorus
stack(
  note("a1 e2").s("sawtooth").pan(0.3),
  note("a1 e2").s("sawtooth").detune(7).pan(0.7).delay(0.008)
).lpf(800)

// Wide pad
stack(
  note("c3 e3 g3").s("saw").pan(0.2),
  note("c3 e3 g3").s("saw").detune(5).pan(0.5),
  note("c3 e3 g3").s("saw").detune(-5).pan(0.8)
).lpf(2000).reverb(0.3)
```

## Classic Hardware Emulations

### Quick Reference

| Hardware Effect | Strudel Equivalent |
|-----------------|-------------------|
| M8 MFX Chorus | `.juxBy(0.4, x => x.detune(8))` |
| OT Spatializer | `.pan(sine.range(0.2, 0.8).slow(2))` |
| OT Chorus | `.add(note("0, 0.07")).pan("<0.3 0.7>")` |
| Stereo Widener | `.juxBy(0.5, x => x.delay(0.015))` |
| Haas Effect | `stack(s, s.delay(0.02).pan(0.8))` |

### Extended Classic Chorus Implementations

These emulate classic hardware chorus units. Note: `detune()` may not work with samples - these are designed for synth oscillators.

```javascript
// 1. Auto-Pan - classic LFO panning
const fxAutoPan = p => p.pan(sine.range(0.2, 0.8).slow(2));

// 2. Widener - Haas-style delay spread
const fxWidener = p => p.juxBy(0.5, x => x.delay(0.015));

// 3. M8 Chorus - detune + delay spread
const fxM8 = p => p.chorus(0.6).juxBy(0.4, x => x.delay(0.005));

// 4. OT Chorus - detuned layer with pan
const fxOT = p => p.chorus(0.5).pan("<0.3 0.7>");

// 5. Juno 60 - lush BBD-style detune + delay
const fxJuno = p => p.chorus(0.7).juxBy(0.5, x => x.delay(0.012));

// 6. Dimension D - wide multi-voice ensemble
const fxDimensionD = p => p.chorus(0.8).juxBy(0.6, x => x.delay(0.008));

// 7. CE-1 - warm subtle Boss chorus
const fxCE1 = p => p.chorus(0.4).juxBy(0.35, x => x.delay(0.018));

// 8. Leslie - rotary speaker simulation
const fxLeslie = p => p.pan(sine.range(0.15, 0.85).slow(1.5)).vib(3).vibmod(0.4);
```

### Using as Selectable Effects (Experimental)

To make effects selectable via slider, define them as functions and use `pick()` with `.map()`:

```javascript
const stereoPick = slider(0, 0, 8, 1);

const stereoFx = [
  p => p,  // 0: off
  p => p.pan(sine.range(0.2, 0.8).slow(2)),           // 1: auto-pan
  p => p.juxBy(0.5, x => x.delay(0.015)),             // 2: widener
  p => p.chorus(0.6).juxBy(0.4, x => x.delay(0.005)), // 3: M8
  p => p.chorus(0.5).pan("<0.3 0.7>"),                // 4: OT
  p => p.chorus(0.7).juxBy(0.5, x => x.delay(0.012)), // 5: Juno
  p => p.chorus(0.8).juxBy(0.6, x => x.delay(0.008)), // 6: Dimension D
  p => p.chorus(0.4).juxBy(0.35, x => x.delay(0.018)),// 7: CE-1
  p => p.pan(sine.range(0.15, 0.85).slow(1.5)).vib(3).vibmod(0.4) // 8: Leslie
];

const myPattern = note("a1 e2").s("sawtooth").lpf(500);

// Apply selected effect
pick(stereoPick, stereoFx.map(fx => fx(myPattern)));
```

**Known Issues:**
- `detune()` may not work with samples (works better with synth oscillators)
- `.add(note(...))` for layering may not combine properly with complex patterns
- `chorus()` parameter is 0-1 range (depth/wet-dry) but effect can be subtle
- The slider approach creates all effect variants upfront, which may impact performance

## Tips

- Apply stereo functions **after** note/sound but **before** filters and other effects
- `juxBy` values of 0.3-0.6 give subtle width without obvious separation
- Combine techniques: `.juxBy(0.3, x => x.detune(5)).pan(sine.range(0.4, 0.6).slow(4))`
- For bass, keep width subtle (0.2-0.3) to maintain low-end focus
- For samples, `juxBy` with `delay()` works more reliably than `detune()`

## References

- [Strudel Effects Documentation](https://strudel.cc/learn/effects/)
- [Pattern Effects Workshop](https://strudel.cc/workshop/pattern-effects/)
