import { scanPosts, WORDS, BASENAME } from "./post.data";

export default async () => {
  const posts = await scanPosts(WORDS);
  return {
    urls: posts.map((post) => {
      const path = (post.slug ?? post.filename).replace(/^\//, "");
      return `${BASENAME}/post/${path}.html`;
    }),
  };
};
