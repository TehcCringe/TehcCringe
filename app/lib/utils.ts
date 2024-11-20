export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .trim();
};
