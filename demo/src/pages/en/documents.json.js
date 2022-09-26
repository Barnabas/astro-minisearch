import { getDocuments } from "@barnabask/astro-minisearch";

export const get = async () => {
  const documents = await getDocuments(import.meta.glob(`./**/*.md*`));
  return { body: JSON.stringify(documents) };
}
