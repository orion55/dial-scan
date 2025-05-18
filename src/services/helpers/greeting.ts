const cfonts = require("cfonts");

export const printGreeting = () => {
  cfonts.say("Dial scan", {
    font: "block",
    colors: ["green", "gray"],
    background: "transparent",
  });
};
