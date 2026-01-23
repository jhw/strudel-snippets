# Loading Samples in Strudel

## From GitHub Repository

The simplest method using the `github:` shortcut:

```javascript
await samples('github:yaxu/clean-breaks/main')
await samples('github:tidalcycles/dirt-samples')
```

Format: `github:<user>/<repo>/<branch>` (branch defaults to `main` if omitted)

Requires a `strudel.json` file at the repository root.

## From GitHub Gist

Gists require the full raw URL (no shortcut):

```javascript
samples('https://gist.githubusercontent.com/<user>/<gist-id>/raw/<filename>.json')
```

**Example:**

```javascript
samples('https://gist.githubusercontent.com/felixroos/b9d461966ae1aaa660beea7c61482d21/raw/dirt-samples.json')
```

**How to get the raw gist URL:**

1. Go to your gist on GitHub
2. Click the "Raw" button on the JSON file
3. Copy that URL (starts with `gist.githubusercontent.com`)

## From Local Files

### Method 1: Import Sounds Folder (Browser REPL)

1. Go to the `sounds` tab in Strudel REPL
2. Click "import sounds folder"
3. Select a folder from your disk

**Expected folder structure:**

```
samples/
├─ swoop/
│  ├─ swoopshort.wav
│  └─ swooplong.wav
└─ smash/
   ├─ smashhigh.wav
   └─ smashlow.wav
```

**Usage:**

```javascript
s("swoop:0 swoop:1 smash:0")
```

Samples within folders are indexed alphabetically, starting from zero.

### Method 2: Local Server with @strudel/sampler

Run a local file server (requires Node.js):

```bash
cd /path/to/samples
npx @strudel/sampler
```

Then in Strudel:

```javascript
samples('http://localhost:5432/')
n("<0 1 2>").s("swoop smash")
```

Auto-generates `strudel.json` based on folder structure. View results at `http://localhost:5432`.

### Method 3: Desktop App

The [Strudel desktop app](https://github.com/tidalcycles/strudel/releases) can load directly from disk:

```javascript
samples('~/music/mysamples/')
```

Creates a `strudel.json` in that directory automatically.

Note: Performance is experimental on macOS/Linux.

## JSON Format

For gists and custom URLs, you need a `strudel.json` style file:

```json
{
  "_base": "https://your-audio-host.com/samples/",
  "bd": ["bd/kick1.wav", "bd/kick2.wav"],
  "sd": ["sd/snare1.wav"]
}
```

Or with full URLs:

```json
{
  "bd": ["https://example.com/kick.wav"],
  "sd": ["https://example.com/snare.wav"]
}
```

## Caching

Strudel caches JSON files aggressively. If you update remote samples, hard-refresh to see changes:

- macOS: `Cmd+Shift+R`
- Windows/Linux: `Ctrl+Shift+R`

## References

- [Strudel Samples Documentation](https://strudel.cc/learn/samples/)
- [Load samples from URL - PR #239](https://github.com/tidalcycles/strudel/pull/239)
- [Flexible JSON format - Issue #540](https://github.com/tidalcycles/strudel/issues/540)
- [Strudel Blog](https://strudel.cc/blog/)
