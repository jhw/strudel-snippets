#!/usr/bin/env python3
"""
Add semicolons to strudel.js files for Emacs linter compatibility.
Handles multi-line expressions by checking per-line bracket balance.
"""

import re
from pathlib import Path


def analyze_line(line):
    """
    Analyze a line for bracket balance and string state.
    Returns (paren_delta, bracket_delta, brace_delta, ends_in_string, ends_in_template)
    """
    paren = 0
    bracket = 0
    brace = 0
    in_string = False
    string_char = None
    in_template = False

    i = 0
    while i < len(line):
        char = line[i]

        if in_string:
            if char == '\\' and i + 1 < len(line):
                i += 2
                continue
            if char == string_char:
                in_string = False
            i += 1
            continue

        if in_template:
            if char == '\\' and i + 1 < len(line):
                i += 2
                continue
            if char == '`':
                in_template = False
            i += 1
            continue

        # Check for comment
        if char == '/' and i + 1 < len(line):
            if line[i + 1] == '/':
                break
            if line[i + 1] == '*':
                end = line.find('*/', i + 2)
                if end != -1:
                    i = end + 2
                    continue
                else:
                    break

        if char in '"\'':
            in_string = True
            string_char = char
            i += 1
            continue

        if char == '`':
            in_template = True
            i += 1
            continue

        if char == '(':
            paren += 1
        elif char == ')':
            paren -= 1
        elif char == '[':
            bracket += 1
        elif char == ']':
            bracket -= 1
        elif char == '{':
            brace += 1
        elif char == '}':
            brace -= 1

        i += 1

    return paren, bracket, brace, in_string, in_template


def should_add_semicolon(line, next_line, pending_parens, pending_brackets, all_lines, line_idx, in_object_literal):
    """Determine if a line should get a semicolon."""
    stripped = line.rstrip()
    next_stripped = next_line.strip() if next_line else ""

    # Empty or whitespace-only lines
    if not stripped or stripped.isspace():
        return False

    # Comment lines
    if stripped.lstrip().startswith('//'):
        return False

    # Already ends with semicolon
    if stripped.endswith(';'):
        return False

    # Inside object literal - properties use commas, not semicolons
    if in_object_literal:
        return False

    # We have unclosed parens/brackets from previous lines waiting to be closed
    # This means we're in a multi-line expression
    if pending_parens > 0 or pending_brackets > 0:
        return False

    # Check this line's own balance
    p, b, br, in_str, in_tpl = analyze_line(stripped)

    # If this line has unclosed parens/brackets, it continues to next line
    if p > 0 or b > 0:
        return False

    # If we're in an unclosed string/template, no semicolon
    if in_str or in_tpl:
        return False

    # Block/structure characters that don't need semicolons
    if stripped.endswith(('{', ',', '=>')):
        return False

    # Opening brackets at end
    if stripped.endswith(('(', '[')):
        return False

    # Closing brace - usually doesn't need semicolon
    if stripped.endswith('}'):
        return False

    # Line ends with operator - continuation
    continuation_ops = ('+', '-', '*', '/', '%', '&&', '||', '?', ':', '=', '|', '&', '^', '~')
    for op in continuation_ops:
        if stripped.endswith(op) and not stripped.endswith('*/'):
            return False

    # Look for method chain continuation - skip past comment lines
    def find_next_code_line(lines, start_idx):
        for j in range(start_idx, len(lines)):
            s = lines[j].strip()
            if s and not s.startswith('//'):
                return s
        return ""

    next_code = find_next_code_line(all_lines, line_idx + 1)

    # Next code line starts with . (method chain)
    if next_code.startswith('.'):
        return False

    # Next code line starts with operator (continuation)
    if next_code and next_code[0] in '+-*/%&|^?:':
        return False

    # Next code line starts with closing bracket then chain
    if re.match(r'^[\)\]]\s*\.', next_code):
        return False

    return True


def is_object_literal_start(line):
    """Check if a line starts an object literal (not a code block)."""
    stripped = line.rstrip()
    # Object literal patterns:
    # - `= {` assignment to object
    # - `: {` nested object in object literal
    # - `({ ` object as function arg
    # - `[{` object in array
    # NOT object literals:
    # - `) {` block after condition
    # - `=> {` arrow function body
    # - `function { ` function body
    if re.search(r'[=:,\[]\s*\{$', stripped):
        return True
    if re.search(r'\(\s*\{$', stripped):
        return True
    return False


def process_file(filepath):
    """Process a single file, adding semicolons where needed."""
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    result = []

    # Stack of (pending_parens, pending_brackets, is_object_literal) for each block level
    # When we enter a block with {, push current state and start fresh
    # When we exit with }, pop to restore previous state
    context_stack = []
    pending_parens = 0
    pending_brackets = 0
    in_object_literal = False

    for i, line in enumerate(lines):
        next_line = lines[i + 1] if i + 1 < len(lines) else None
        stripped = line.rstrip()

        # Analyze this line
        p, b, br, ends_in_str, ends_in_tpl = analyze_line(stripped)

        # Handle block entry BEFORE deciding on semicolon
        # If this line opens a block/object, push current context
        if br > 0:
            for _ in range(br):
                context_stack.append((pending_parens + p, pending_brackets + b, in_object_literal))
                pending_parens = 0
                pending_brackets = 0
                # Check if this opens an object literal
                in_object_literal = is_object_literal_start(stripped)
            p = 0  # Already accounted for
            b = 0

        # Handle block exit
        if br < 0:
            for _ in range(-br):
                if context_stack:
                    pending_parens, pending_brackets, in_object_literal = context_stack.pop()
                else:
                    pending_parens = 0
                    pending_brackets = 0
                    in_object_literal = False

        # Determine if we should add semicolon
        if should_add_semicolon(stripped, next_line, pending_parens, pending_brackets, lines, i, in_object_literal):
            result.append(stripped + ';')
        else:
            result.append(stripped)

        # Update pending counts for next line (if not already handled by block logic)
        if br == 0:
            pending_parens += p
            pending_brackets += b

        # Prevent negative values
        pending_parens = max(0, pending_parens)
        pending_brackets = max(0, pending_brackets)

    new_content = '\n'.join(result)

    if new_content != content.rstrip():
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False


def main():
    patreon_dir = Path(__file__).parent.parent / 'switchangel' / 'patreon'

    print(f"Processing files in {patreon_dir}")
    print()

    modified_count = 0
    for filepath in sorted(patreon_dir.glob('*.strudel.js')):
        if process_file(filepath):
            print(f"  Modified: {filepath.name}")
            modified_count += 1
        else:
            print(f"  Unchanged: {filepath.name}")

    print()
    print(f"Modified {modified_count} files")


if __name__ == '__main__':
    main()
