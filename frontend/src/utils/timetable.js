export const generateMergedMap = (data) => {
  const map = {};

  data.forEach((course) => {
    const groupedByDay = {};

    course.schedule.forEach(({ day, time }) => {
      const p = parseInt(time.replace("P", ""), 10);
      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(p);
    });

    Object.keys(groupedByDay).forEach((day) => {
      const sorted = groupedByDay[day].sort((a, b) => a - b);

      let start = sorted[0];
      let count = 1;

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1] + 1) {
          count++;
        } else {
          map[`${day}-${start}`] = { colSpan: count, course };
          start = sorted[i];
          count = 1;
        }
      }

      map[`${day}-${start}`] = { colSpan: count, course };
    });
  });

  return map;
};

export const getColor = (code) => {
  const courseColors = [
    "#EDE9FE",
    "#BBF7D0",
    "#BFDBFE",
    "#FCE7F3",
    "#FEF3C7",
    "#FECACA",
    "#FEF3C7",
    "#D1FAE5",
    "#DBEAFE",
    "#E9D5FF",
    "#FBCFE8",
    "#FEF9C3",
    "#CFFAFE",
    "#FED7AA",
    "#CCFBF1",
    "#FBCFE8",
    "#E0E7FF",
    "#ECFCCB",
    "#FEF3C7",
    "#E0F2FE",
  ];

  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash + code.charCodeAt(i) * (i + 1)) % 1000;
  }
  return courseColors[hash % courseColors.length];
};
