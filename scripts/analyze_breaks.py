#!/usr/bin/env python3
"""
Analyze WAV files in clean-breaks to determine their bar lengths.

Assumption: All breaks are between 90-135 BPM.
At these tempos, bar durations are:
- 1 bar: 1.78s (135 BPM) to 2.67s (90 BPM)
- 2 bars: 3.56s (135 BPM) to 5.33s (90 BPM)
- 4 bars: 7.11s (135 BPM) to 10.67s (90 BPM)
- 8 bars: 14.22s (135 BPM) to 21.33s (90 BPM)
"""

import os
import json
from pydub import AudioSegment

SOUNDS_DIR = "../clean-breaks/sounds"

# BPM range assumption
MIN_BPM = 90
MAX_BPM = 135

def get_bar_duration_range(num_bars):
    """Return (min_duration, max_duration) for given bar count at BPM range."""
    # seconds per bar = 60 / BPM * 4 (4 beats per bar)
    min_duration = (60 / MAX_BPM) * 4 * num_bars
    max_duration = (60 / MIN_BPM) * 4 * num_bars
    return (min_duration, max_duration)

def infer_bar_count(duration_seconds):
    """Infer the most likely bar count for a given duration."""
    candidates = [1, 2, 4, 8]

    for bars in candidates:
        min_dur, max_dur = get_bar_duration_range(bars)
        if min_dur <= duration_seconds <= max_dur:
            # Calculate implied BPM
            implied_bpm = (60 * 4 * bars) / duration_seconds
            return bars, implied_bpm

    # If no exact match, find closest
    best_bars = None
    best_bpm = None
    min_error = float('inf')

    for bars in candidates:
        min_dur, max_dur = get_bar_duration_range(bars)
        mid_dur = (min_dur + max_dur) / 2
        error = abs(duration_seconds - mid_dur)
        if error < min_error:
            min_error = error
            best_bars = bars
            implied_bpm = (60 * 4 * bars) / duration_seconds
            best_bpm = implied_bpm

    return best_bars, best_bpm

def main():
    # Print bar duration ranges for reference
    print("Bar duration ranges (at 90-135 BPM):")
    for bars in [1, 2, 4, 8]:
        min_dur, max_dur = get_bar_duration_range(bars)
        print(f"  {bars} bar(s): {min_dur:.2f}s - {max_dur:.2f}s")
    print()

    # Mapping from filename patterns to strudel sample names
    # Based on the strudel.json in clean-breaks
    results = []

    for filename in sorted(os.listdir(SOUNDS_DIR)):
        if not filename.endswith('.wav'):
            continue

        filepath = os.path.join(SOUNDS_DIR, filename)
        audio = AudioSegment.from_wav(filepath)
        duration = len(audio) / 1000.0  # Convert ms to seconds

        bars, bpm = infer_bar_count(duration)

        results.append({
            'filename': filename,
            'duration': duration,
            'bars': bars,
            'implied_bpm': bpm
        })

        status = "OK" if MIN_BPM <= bpm <= MAX_BPM else "OUTLIER"
        print(f"{filename[:50]:50s} {duration:6.2f}s -> {bars} bars @ {bpm:5.1f} BPM [{status}]")

    # Summary
    print("\n" + "="*80)
    print("SUMMARY BY BAR COUNT:")
    bar_counts = {}
    for r in results:
        bars = r['bars']
        if bars not in bar_counts:
            bar_counts[bars] = []
        bar_counts[bars].append(r['filename'])

    for bars in sorted(bar_counts.keys()):
        print(f"\n{bars} bar(s): {len(bar_counts[bars])} samples")
        for f in bar_counts[bars]:
            print(f"  - {f[:60]}")

    # Output JSON for use in strudel
    print("\n" + "="*80)
    print("JSON OUTPUT (bar counts):")
    bar_map = {r['filename']: r['bars'] for r in results}
    print(json.dumps(bar_map, indent=2))

if __name__ == "__main__":
    main()
