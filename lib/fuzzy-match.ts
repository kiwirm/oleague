import Fuse from "fuse.js";

const fuzzyMatch = (
  competitors: {
    competitorName: string;
    competitorId: number;
  }[],
  competitorName: string
) => {
  const fuse = new Fuse(competitors, {
    keys: ["competitorName"],
    threshold: 0.3,
    includeScore: true,
  });

  const matches = fuse.search(competitorName);

  return matches.map((match) => ({
    score: match.score!,
    match: {
      name: match.item.competitorName,
      id: match.item.competitorId,
    },
  }));
};

export default fuzzyMatch;
