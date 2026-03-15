await samples('https://gist.githubusercontent.com/jhw/66bffe6cab8193cc983249c4f0270e55/raw/eca3c9b4757544234e820e483c38964c99490f55/strudel.json');

setCps(128 / 4 / 60);

const breakPick = slider(4, 0, 15, 1);

const allBreaks = ["afraid_animal", 
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

note(36).sound(pick(breakPick, allBreaks)).loopAt(2);

  





