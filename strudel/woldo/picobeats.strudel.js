await samples('https://gist.githubusercontent.com/jhw/66bffe6cab8193cc983249c4f0270e55/raw/strudel.json');

setCps(128 / 4 / 60);

const breakPick = slider(11, 0, 15, 1);

const breaks = ["afraid_animal", 
                "calm_breath", 
                "clear_prior", 
                "electrical_top", 
                "extreme_status", 
                "familiar_recording", 
                "famous_mate", 
                "fit_leading", 
                "inside_eat", 
                "only_funny", 
                "public_maximum", 
                "regular_display", 
                "scared_motor", 
                "severe_television", 
                "useful_parking", 
                "western_interview"];

const patternPick = slider(3, 0, 7, 1);

const patterns = [
  "{0 1 2 3 4 5 6 7}%8",
  "{7 6 5 4 3 2 1 0}%8",
  "{0 1 2 3}%8",
  "{3 2 1 0}%8",
  "{4 5 6 7}%8",
  "{7 6 5 4}%8",
  "{0 2 4 6}%8",
  "{6 4 2 0}%8"
];

note(36).sound(pick(breakPick, breaks)).loopAt(2).slice(16, pick(patternPick, patterns)).delay(0.5);
