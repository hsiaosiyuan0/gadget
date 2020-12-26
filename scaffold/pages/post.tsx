import React, { useEffect } from "react";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import visit from "unist-util-visit";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Toc } from "@/components/toc";
import type { Post } from "./post.data";

import styles from "@/pages/post.pure.scss";

export const outlet = "@/outlets/default.tsx";

var processor = unified()
  .use(markdown)
  .use(() => {
    return function (node) {
      visit(node, "heading", (node) => {
        let name = "";
        const children = node.children as any;
        if (children[0] && children[0].type === "text") {
          name = children[0].value;
        }
        node.data = {
          hProperties: { id: name.replace(/\s/g, "") },
        };
      });
    };
  })
  .use(remark2rehype)
  .use(rehype2react, { createElement: React.createElement });

export default function PostView(props: {
  data: { post: Post & { toc: any }; catalog: any; title: string };
}) {
  const { post, catalog, title } = props.data;

  useEffect(() => {
    window.scrollTo(0, 0);
    const Prism = (window as any).Prism;
    if (Prism) Prism.highlightAll();
  }, [props.data]);

  return (
    <div>
      <Header title={title} />
      <Sidebar data={catalog}></Sidebar>
      <div className={[styles.post, "line-numbers"].join(" ")}>
        {/* <Head>
          <title>{post.rawMeta.title}</title>
        </Head> */}
        <div key={post.filename}>
          {processor.processSync(post.content).result as string}
        </div>
      </div>
      <Toc data={post.toc}></Toc>
    </div>
  );
}
