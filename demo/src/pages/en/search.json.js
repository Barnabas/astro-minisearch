import { getSearchIndex } from "@barnabask/astro-minisearch";

export const get = () => getSearchIndex(import.meta.glob(`./**/*.md*`));
