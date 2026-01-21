//@title Amen Infinity @By Switch Angel
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
});
register('trancegate', (density, seed, length, x) => {
    return x.struct(rand.mul(density).round().seg(16).rib(seed, length)).fill().clip(.7);
});
// --- End baked register functions ---

setCpm(170/4);
samples('github:switchangel/pad');

$BREAK: s("brk/2").fit().scrub(irand(16).div(16).seg(8))
    .almostNever(ply("2 | 4"))
    .room(.3).ir("swpad:3").irbegin(.5)
    .roomsize(.4);

$BASS: n("<5 -1 0@2>".sub(7))
    .scale("C:minor").s("triangle")
    .trancegate(1.3,3,2)
    .sometimesBy(.2, x => x.trans("12"))
    .slow(2).penv(24).pdec(.05).clip(.94).dec(2);
