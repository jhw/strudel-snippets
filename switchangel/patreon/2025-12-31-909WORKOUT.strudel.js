
//@title 909 WORKOUT @by Switch Angel
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

setCpm(134/4);
register('nine', (pat) => {
    return pat.bank('tr909');
});

$KICK: s("bd").trancegate(slider(0.8,.4,2,.1),45,1).nine();

$HAT: s("hh").trancegate(slider(0.8,.4,2,.1),6,1).cut(2);

$COWBELL: s("cb").trancegate(slider(0.4,.4,2,.1),7,2);

$RIM: s("rim").trancegate(slider(0.7,.4,2,.1),48,2).nine().gain(.7);

$TOM: s("lt").trancegate(slider(0.9,.4,2,.1),16,1).nine();

_$OPENHAT: s("<- oh>*8").nine().gain(.7)
    .almostNever(ply("2")).clip(1).cut(2);
