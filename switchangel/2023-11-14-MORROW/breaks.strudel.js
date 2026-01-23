//@title Morrow (drums) @by Switch Angel

await samples('github:yaxu/clean-breaks/main');

setCps(172 / 4 / 60);

const beatMash = slider(3, 0, 5, 1);
const breakNumCycles = 2;

const breakPatterns = [
  "{5 5 3 5}%8",
  "{2 6 7 4}%8",
  "{1 9 2 5}%8",
  "{8 3 6 1}%8"
];

$BREAKS: note(36).sound("riffin")
    .loopAt(breakNumCycles)
    .slice(8 * breakNumCycles, pick(beatMash, breakPatterns));
  
