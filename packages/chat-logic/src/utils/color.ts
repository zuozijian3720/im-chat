// convert #hex notation to rgb array
const parseColor = function (hexStr: string) {
  return hexStr.length === 4
    ? hexStr
        .substr(1)
        .split("")
        .map(function (s) {
          return 0x11 * parseInt(s, 16);
        })
    : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(
        function (s) {
          return parseInt(s, 16);
        }
      );
};

// zero-pad 1 digit to 2
const pad = function (s: string) {
  return s.length === 1 ? "0" + s : s;
};

export const gradientColors = function (
  _start: string,
  _end: string,
  steps: number,
  gamma: number = 1
) {
  let i, j, ms, me;
  const output: string[] = [];
  const so: string[] = [];
  const normalize = function (channel: number) {
    return Math.pow(channel / 255, gamma);
  };
  const start = parseColor(_start).map(normalize);
  const end = parseColor(_end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(
        Math.round(
          Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255
        ).toString(16)
      );
    }
    output.push("#" + so.join(""));
  }
  return output;
};
