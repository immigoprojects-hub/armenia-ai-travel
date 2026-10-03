// Small provider boundary: rules return suggestions without changing trip state.
// A future agent can return the same shape; confirmation stays in the UI.
export function selectRouteSuggestions(context) {
  const { candidates, stops, dayIndex, dayCount, endMinutes, travelMinutes } = context;
  const tight = endMinutes > 1170 || travelMinutes > 210;
  return {
    tight,
    movable:
      tight && stops.length > 2 && dayIndex < dayCount - 1
        ? [...stops].reverse().find((s) => s.entity.category === "attractions")
        : null,
    food: candidates.find((c) => c.e.category === "restaurants-cafes"),
    sight: tight ? null : candidates.find((c) => c.e.category === "attractions"),
    source: "rules",
  };
}
