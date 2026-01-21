#!/usr/bin/env python3
"""
Bakes registered functions from prebake.strudel directly into patreon scripts.
"""

import os
import re
from pathlib import Path

# Define the register functions from prebake.strudel
# These are extracted exactly as they appear in the prebake file

REGISTER_FUNCTIONS = {
    'acidenv': '''// tb303 style filter envelope control between 0 & 1 values for useful range
register('acidenv', (x, pat) => pat.lpf(100)
  .lpenv(x * 9).lps(.2).lpd(.12).lpq(2)
)''',

    'rlpf': '''// lpf between 0 and 1
register('rlpf', (x, pat) => { return pat.lpf(pure(x).mul(12).pow(4)) })''',

    'rhpf': '''//hpf between 0 and 1
register('rhpf', (x, pat) => { return pat.hpf(pure(x).mul(12).pow(4)) })''',

    'fill': '''// fill in gaps between events
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
})''',

    'trancegate': '''register('trancegate', (density, seed, length, x) => {
  return x.struct(rand.mul(density).round().seg(16).rib(seed, length)).fill().clip(.7)
})''',

    'fmtime': '''register('fmtime', (start,length, pat) => {
  let modu = time.mod(length).add(start)
  return pat.fm(modu).fmh(modu)
})''',

    'stxt': '''//stext
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
})''',
}

# Window functions (not register())
WINDOW_FUNCTIONS = {
    'pk': '''window.pk = function (...args) {
  const control = args.length > 2 ? args.pop() : 0
  return pick(args, control)
}''',
}

# Dependencies: some functions depend on others
DEPENDENCIES = {
    'trancegate': ['fill'],  # trancegate uses .fill()
}


def find_used_functions(content):
    """Find which registered functions are used in the script."""
    used = set()

    # Check for registered functions
    for func_name in REGISTER_FUNCTIONS.keys():
        # Look for .funcname( or funcname( patterns
        pattern = rf'\.{func_name}\s*\(|(?<![a-zA-Z_]){func_name}\s*\('
        if re.search(pattern, content):
            used.add(func_name)

    # Check for window functions
    for func_name in WINDOW_FUNCTIONS.keys():
        pattern = rf'(?<![a-zA-Z_]){func_name}\s*\('
        if re.search(pattern, content):
            used.add(func_name)

    return used


def resolve_dependencies(used_functions):
    """Add any dependencies for the used functions."""
    resolved = set(used_functions)
    for func in used_functions:
        if func in DEPENDENCIES:
            for dep in DEPENDENCIES[func]:
                resolved.add(dep)
    return resolved


def is_already_defined(content, func_name):
    """Check if a function is already defined in the content."""
    # Check for register('funcname' or register("funcname"
    pattern = rf'''register\s*\(\s*['\"]{func_name}['\"]\s*,'''
    if re.search(pattern, content):
        return True
    # Check for window.funcname
    pattern = rf'window\.{func_name}\s*='
    if re.search(pattern, content):
        return True
    return False


def find_insert_position(content):
    """Find the position to insert register statements (after initial comments/title)."""
    lines = content.split('\n')
    # Find the end of initial comment block (lines starting with // or empty)
    insert_pos = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('//') or stripped == '':
            insert_pos = i + 1
        else:
            # Found first non-comment, non-empty line
            break
    return insert_pos


def process_file(filepath):
    """Process a single strudel script file."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Find which functions are used
    used = find_used_functions(content)
    if not used:
        print(f"  No registered functions used in {filepath.name}")
        return False

    # Resolve dependencies
    used = resolve_dependencies(used)

    # Filter out already defined functions
    needed = set()
    for func in used:
        if not is_already_defined(content, func):
            needed.add(func)

    if not needed:
        print(f"  All needed functions already defined in {filepath.name}")
        return False

    print(f"  Adding to {filepath.name}: {', '.join(sorted(needed))}")

    # Build the register block
    register_lines = []
    register_lines.append("// --- Baked register functions from prebake.strudel ---")

    # Order matters: dependencies first
    ordered_funcs = []
    # Add dependencies first
    for func in sorted(needed):
        if func in DEPENDENCIES.values():
            ordered_funcs.append(func)
    # Then add the rest
    for func in sorted(needed):
        if func not in ordered_funcs:
            ordered_funcs.append(func)

    # Actually, let's be more specific about order
    # fill must come before trancegate
    ordered_funcs = []
    if 'fill' in needed:
        ordered_funcs.append('fill')
    for func in sorted(needed):
        if func != 'fill':
            ordered_funcs.append(func)

    for func in ordered_funcs:
        if func in REGISTER_FUNCTIONS:
            register_lines.append(REGISTER_FUNCTIONS[func])
        elif func in WINDOW_FUNCTIONS:
            register_lines.append(WINDOW_FUNCTIONS[func])

    register_lines.append("// --- End baked register functions ---")
    register_lines.append("")

    register_block = '\n'.join(register_lines)

    # Find insert position
    lines = content.split('\n')
    insert_pos = find_insert_position(content)

    # Insert the block
    new_lines = lines[:insert_pos] + register_block.split('\n') + lines[insert_pos:]
    new_content = '\n'.join(new_lines)

    # Write back
    with open(filepath, 'w') as f:
        f.write(new_content)

    return True


def main():
    patreon_dir = Path(__file__).parent.parent / 'switchangel' / 'patreon'

    print(f"Processing files in {patreon_dir}")
    print()

    modified_count = 0
    for filepath in sorted(patreon_dir.glob('*.txt')):
        if process_file(filepath):
            modified_count += 1

    print()
    print(f"Modified {modified_count} files")


if __name__ == '__main__':
    main()
