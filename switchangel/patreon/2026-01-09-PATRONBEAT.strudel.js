//@title Patron Beat 26.1.9 @By Everyone
register('colorparty', (p, pat) => {
    const hue = Math.floor(p * 360 );
    const color = 'hsl(' + hue + ', 100%, 50%)';
    return pat.color(color);
});

const angel = [
    "Aaron",  "adorfer",  "AdrianW",
    "Barry",  "calcuku",  "Daniel Paradis",
    "Eleanor Lamb",  "Emma Perry",  "Fred",
    "Fred Hicks",  "Ghost of Michael Masi",  "Henry",
    "Jake ",  "jangxx",  "Jose_D_S",
    "Joshua A.C. Newman",  "jslee",  "Jussi Mäki",
    "Kiterati99",  "Kristian Dorland",  "matt",
    "Matthew Robinson",  "Constantnoise",  "Pc-chan",
    "pi",  "recursive",  "Richard Langis",
    "rob dennis",  "Russell Royer",  "Sam Cave",
    "Sam Raredon",  "Scott",  "SecretKea",
    "Sid_Cypher ",  "Somedudeontheweb",  "Stephen Duane",
    "Tom Burke",  "Vilirio ",  "WilliW",
    "Your Old Friend Dan"
];

const agent_of_the_realm = [
    "Andy Cowley",  "arden",  "Asterión",
    "Axel Großklaus",  "Be-Ankh-Ah",  "Benjamin Nolan",
    "blackshfit",  "Boele Kuipers",  "Bryan Sarpad",
    "Can Akin",  "Carlos Goma",  "ccb-somany",
    "Chango",  "Charlie Juno Jr",  "Christopher Embrey",
    "Christopher Emmick",  "Christopher Kight",  "Chronolithe",
    "Claire Mason",  "Daft",  "David Baghurst",
    "David Katz",  "Delaney",  "Der Dackel",
    "Pigeon",
    "Dillon Summers",  "Dominic Talbot",  "Douglas ",
    "Ebike Builder",  "Emily Swift",  "Esk",
    "Esk",  "fluxstorm0",  "Galen Evan Kowalski Buttitta",
    "Grey",  "hackbyte ",  "Hailey Halcyon",
    "Hazel Quantock",  "Innes Reid",  "james schaefer",
    "Janeishly",  "Jason Whitlark",  "Jay Cuthrell",
    "Jessica Canady",  "John Björk",  "Joseph Crail",
    "Karhu",  "Keleko",  "Kenan Bgn",
    "KGE003",  "Kieren Martin",  "Killian Grant",
    "koh501",  "Kumlekar",  "Lance",
    "Lee Nuckols",  "LetsGoRosco",  "Lex Murden",
    "Marcus",  "mauricio gonzalez de la fuente",  "MemeMasterJamers",
    "Meteren",  "nar",  "Nohus",
    "patchrick",  "phobonym",  "Puppy Of Argon",
    "Renzo Tavanti",  "Rey",  "Rick Wells",
    "Sage",  "Saggi Malachi",  "Scott Hanes",
    "Skjalm Arrøe",  "Snoooder",  "Sofia Razón",
    "Terrence Zhang",  "ThomasF",  "Varg",
    "Vincent Brakshoofden",  "William Lamy",  "Windy the Deer",
    "Zimi"
];

const le = agent_of_the_realm.length;
const le2 = angel.length;

$AGENTS_LEAD: s("sawtooth!8")
    .stxt(pick(agent_of_the_realm,  time.fast(8).mod(le))).att(0).fast(2)
    .scale("e:major:pentatonic").att(0).lpa(0).room(.7)
    .acidenv(slider(0.773)).lpd(.7)
    .delaytime(3/16).delay(.5).pan(rand).colorparty(rand).o(3).gain(.7)
    ._pianoroll();

$ANGEL_HARMONY: s("sawtooth!8").pan(rand.fast(2))
    .stxt(pick(angel,  time.fast(8).mod(le2))).att(0)
    .scale("e:major:pentatonic").att(.1).lpa(0).room(.7)
    .acidenv(slider(0.509)).lpd(.7)
    .delaytime(3/16).delay(.5).o(2).gain(.7)
    ._scope();

$KICK: s("bd:2!4").duck("2:3");

$CLAP: s("<- cp>*4").gain(.6);

$NOISEBURST: s("white").dec(.2)
    .trancegate(1.3,23,1).gain(.5)
    .pan(rand.fast(7)).delay(1).rlpf(rand.fast(7).rib(0,1));

$BASS: note("e2!16".add("<-3 0 <-7 2>@2>/2"))
    .s("supersaw!8").acidenv(slider(0.767));


