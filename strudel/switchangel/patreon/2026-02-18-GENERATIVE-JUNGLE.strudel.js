// @title Generative Jungle @By Switch Angel
setCpm(165/4);

const breakbeat = s("brk")
      .scrub(irand(16).div(16).segment(8))
      .rarely(x => x.ply("<2 4>"));

const melody = n(rand.mul(8).sub(14))
      .scale("E:minor:pentatonic")
      .s("sine")
      .legato(0.5)
      .decay(2.5)
      .slow(2)
      .pan(sine.slow(4))
      .room(0.8);

stack(breakbeat, melody);
