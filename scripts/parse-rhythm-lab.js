#!/usr/bin/env node
/**
 * Parse rhythm-lab analysis results and generate JS arrays for Strudel demo.
 *
 * Usage: node scripts/parse-rhythm-lab.js
 */

const fs = require('fs');
const path = require('path');

const analysisPath = path.join(__dirname, '../../strudel-rhythm-lab/config/analysis-results.json');
const data = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));

const accepted = data.accepted;

// Group by bar count
const byBars = { 1: [], 2: [], 4: [], 8: [], 16: [] };

for (const sample of accepted) {
  const bars = sample.bars;
  if (byBars[bars]) {
    byBars[bars].push({
      name: sample.strudel_name,
      bars: bars,
      bpm: Math.round(sample.bpm)
    });
  }
}

// Sort each group by name
for (const bars of Object.keys(byBars)) {
  byBars[bars].sort((a, b) => a.name.localeCompare(b.name));
}

console.log('// Sample counts by bar length:');
console.log(`// 1-bar: ${byBars[1].length}`);
console.log(`// 2-bar: ${byBars[2].length}`);
console.log(`// 4-bar: ${byBars[4].length}`);
console.log(`// 8-bar: ${byBars[8].length}`);
console.log(`// 16-bar: ${byBars[16].length}`);
console.log(`// Total: ${accepted.length}`);
console.log('');

// Generate arrays
console.log('// === BREAKS BY BAR COUNT ===');
console.log('');

for (const bars of [1, 2, 4, 8]) {
  const names = byBars[bars].map(s => `"${s.name}"`);
  console.log(`const breaks${bars} = [${names.join(', ')}];`);
  console.log('');
}

// All breaks in order
console.log('// All breaks in order (for slider picking)');
const allBreaks = [...byBars[1], ...byBars[2], ...byBars[4], ...byBars[8]];
console.log(`const allBreaks = [...breaks1, ...breaks2, ...breaks4, ...breaks8];`);
console.log('');

// Bar counts array
console.log('// Bar count for each break (parallel array)');
const barCounts = allBreaks.map(s => s.bars);
console.log(`const barCounts = [`);
console.log(`  ${Array(byBars[1].length).fill('1').join(',')},  // ${byBars[1].length} x 1-bar`);
console.log(`  ${Array(byBars[2].length).fill('2').join(',')},  // ${byBars[2].length} x 2-bar`);
console.log(`  ${Array(byBars[4].length).fill('4').join(',')},  // ${byBars[4].length} x 4-bar`);
console.log(`  ${Array(byBars[8].length).fill('8').join(',')}   // ${byBars[8].length} x 8-bar`);
console.log(`];`);
console.log('');

console.log(`// Total breaks: ${allBreaks.length}`);
