export const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "name", label: "Name A–Z" },
  { value: "moq", label: "Lowest minimum order" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
