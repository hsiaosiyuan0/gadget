import fs from "fs";
import path from "path";
import toMd from "mdast-util-to-markdown";
import unified from "unified";
import markdown from "remark-parse";
import unist from "unist";
import vfile from "vfile";
import prettier from "prettier";
import yaml from "yaml";

interface WalkCallback<T> {
  (ctx: T, file: string, meta: fs.Dirent): Promise<void>;
}

async function walkDir<T>(
  root: string,
  ctx: T,
  cb: {
    file: WalkCallback<T>;
    enterDir: WalkCallback<T>;
    leaveDir: WalkCallback<T>;
  }
) {
  const dir = await fs.promises.opendir(root);
  for await (const dirent of dir) {
    if (dirent.name.startsWith(".")) continue;

    const filepath = path.join(root, dirent.name);

    if (dirent.isDirectory()) {
      await cb.enterDir(ctx, filepath, dirent);
      await walkDir(filepath, ctx, cb);
      await cb.leaveDir(ctx, filepath, dirent);
    } else {
      await cb.file(ctx, filepath, dirent);
    }
  }
}

export interface RawMeta {
  slug?: string;
  keywords?: string[];
  [k: string]: any;
}

export interface Post {
  filename: string;
  rawMeta: Record<string, RawMeta>;
  slug: string;
  keywords: string[];
  content: string;
  mtime: number;
}

export interface Category {
  filename: string;
  rawMeta: Record<string, any>;
  slug: string;
  keywords: string[];
  mtime: number;
  children: Array<Post | Category>;
}

interface ScanPostsContext {
  categories: CatalogItem[];
  category: CatalogItem;
}

async function readCategoryYmlMeta(
  categoryPath: string
): Promise<Record<string, any>> {
  const file = path.join(categoryPath, "meta.yml");

  try {
    const content = (await fs.promises.readFile(file)).toString();
    const meta = yaml.parse(content);
    if (meta && typeof meta === "object") return meta;
  } catch (error) {}

  return {};
}

async function readPostMdMeta(postPath: string): Promise<Record<string, any>> {
  try {
    const content = (await fs.promises.readFile(postPath)).toString();
    const matched = content.match(/\s*<!--([\s\S]*?)-->/m);
    let ret: any = {};
    if (matched && matched.length === 2) {
      const meta = yaml.parse(matched[1]);
      if (meta && typeof meta === "object") {
        ret = meta;
      }
    }
    if (!ret.title) {
      ret.title = readPostInlineTitle(content);
    }
    return ret;
  } catch (error) {}

  return {};
}

function readPostInlineTitle(content: string) {
  const matched = content.match(/^#\s([^#\r\n]+)\r?\n?/);
  if (matched && matched.length === 2) {
    return matched[1];
  }
  return undefined;
}

async function restoreDiskCatalog(dir: string) {
  const root: CatalogItem = {
    name: "",
    children: [],
  };
  const ctx: ScanPostsContext = {
    categories: [],
    category: root,
  };

  await walkDir<ScanPostsContext>(dir, ctx, {
    async file(ctx, file) {
      const filename = path.parse(file).name;
      if (file.endsWith(".md")) {
        const meta = await readPostMdMeta(file);
        const post: CatalogItem = {
          name: meta.title ?? filename,
          url: file.replace(dir, ""),
        };
        ctx.category.children!.push(post);
      }
    },
    async enterDir(ctx, file) {
      const filename = path.parse(file).name;
      const meta = await readCategoryYmlMeta(file);
      const category = {
        name: meta.name ?? filename,
        url: file.replace(dir, ""),
        children: [],
      };
      ctx.category.children!.push(category);
      ctx.categories.push(ctx.category);
      ctx.category = category;
    },
    async leaveDir(ctx) {
      ctx.category = ctx.categories.pop()!;
    },
  });
  return root.children!;
}

function postToMdast(post: CatalogItem) {
  return {
    type: "paragraph",
    children: [
      {
        type: "link",
        url: post.url,
        title: null,
        children: [
          {
            type: "text",
            value: post.name,
          },
        ],
      },
    ],
  };
}

function categoryToMdast(category: CatalogItem) {
  const paragraph: any = {
    type: "paragraph",
    children: [
      category.url
        ? {
            type: "link",
            url: category.url,
            title: null,
            children: [
              {
                type: "text",
                value: category.name,
              },
            ],
          }
        : { type: "text", value: category.name },
    ],
  };

  const ret = [paragraph];

  if (category.children) {
    const list: any = {
      type: "list",
      spread: false,
      ordered: false,
      start: null,
      children: category.children.map((child) => {
        return {
          type: "listItem",
          spread: true,
          checked: null,
          children: child.children
            ? categoryToMdast(child)
            : [postToMdast(child)],
        };
      }),
    };
    ret.push(list);
  }

  return ret;
}

function catalogToMd(catalog: CatalogItem[]) {
  const tree = {
    type: "root",
    children: [
      {
        type: "list",
        ordered: false,
        start: null,
        spread: true,
        children: catalog
          .filter((child) => !!child.children)
          .map(categoryToMdast)
          .map((children) => {
            return {
              type: "listItem",
              spread: false,
              checked: null,
              children,
            };
          }),
      },
    ],
  };

  return toMd(tree);
}

export type VisitorHandler = (
  ctx: { [k: string]: any },
  node: unist.Node,
  idx: number,
  parent?: unist.Node
) => void;

export interface Visitor {
  [k: string]:
    | VisitorHandler
    | { before?: VisitorHandler; after?: VisitorHandler };
}

export async function visitNode(
  ctx: { [k: string]: any },
  node: unist.Node,
  visitor: Visitor,
  parent?: unist.Node
) {
  const v = visitor[node.type];
  if (v) {
    if (typeof v === "function") {
      v(ctx, node, 0, parent);
    } else if (v.before) {
      v.before(ctx, node, 0, parent);
    }
  }
  if (Array.isArray(node.children)) {
    (node.children as unist.Node[]).forEach((child) =>
      visitNode(ctx, child, visitor, node)
    );
  }
  if (v && typeof v !== "function" && v.after) {
    v.after(ctx, node, 0, parent);
  }
}

/**
 * it's little hard to imagine the node hierarchies of `list` in remark's ast,
 * since remark's ast is somewhat verbose, consider to paste the markdown
 * content of your list into https://astexplorer.net/ to find out the ast
 *
 * @param node
 */
function getListItemName(node: any): string | undefined {
  if (
    Array.isArray(node.children) &&
    node.children[0] &&
    node.children[0].type === "paragraph" &&
    node.children[0].children[0] &&
    node.children[0].children[0].type === "text"
  ) {
    return node.children[0].children[0].value;
  }
  return undefined;
}

function getListItemLink(
  node: any
): { name?: string; url: string } | undefined {
  if (
    Array.isArray(node.children) &&
    node.children[0] &&
    node.children[0].type === "paragraph" &&
    node.children[0].children[0] &&
    node.children[0].children[0].type === "link"
  ) {
    let name: string | undefined;
    if (node.children[0].children[0].children[0]) {
      name = node.children[0].children[0].children[0].value;
    }
    return {
      name,
      url: node.children[0].children[0].url,
    };
  }
  return undefined;
}

interface CatalogItem {
  name: string;
  url?: string;
  children?: CatalogItem[];
}

async function restoreCatalog(root: string) {
  const file = vfile({ path: path.join(root, "catalog.md") });
  file.contents = (await fs.promises.readFile(file.path!)).toString();

  const tree: { children: CatalogItem[] } = {
    children: [],
  };
  const ctx: any = {
    parent: tree,
    parents: [],
  };

  const catalogVisitor: Visitor = {
    listItem: {
      before(ctx, node) {
        const link = getListItemLink(node);
        const name = getListItemName(node);
        let item: any = {};
        if (link && link.name && link.url && link.url.startsWith("/")) {
          item = {
            ...link,
            children: [],
          };
        } else if (name) {
          item = { name, children: [] };
        }

        ctx.parent.children.push(item);
        ctx.parents.push(ctx.parent);
        ctx.parent = item;
      },
      after(ctx) {
        ctx.parent = ctx.parents.pop();
      },
    },
  };

  await unified()
    .use(markdown)
    .use(function () {
      // below is a `it just works` pattern, maybe here it's better
      // to use a plugin instead of a compiler, this is because in
      // remark's semantic the job of a compiler is doing the ast
      // transformation
      this.Compiler = function (node) {
        visitNode(ctx, node, catalogVisitor);
        return "";
      };
    })
    .process(file);

  return tree.children;
}

/**
 * 1. restore the catalog tree A from catalog.md
 * 2. scan the disk to make another catalog tree B
 * 3. merge the B into A and keeps the order of A
 *
 * @param root
 */
async function updateCatalog(root: string) {
  let old: CatalogItem[] = [];
  try {
    old = await restoreCatalog(root);
  } catch (error) {}
  const catalog = await restoreDiskCatalog(root);

  catalog.forEach((child) => patchNode(old, child));

  function patchNode(parent: CatalogItem[], node: CatalogItem) {
    const i = parent.findIndex((n) => n.name === node.name);
    if (i !== -1) {
      const old = parent[i];
      if (old.children) {
        if (node.children) {
          node.children.forEach((child) => patchNode(old.children!, child));
        } else {
          parent[i] = node;
        }
      }
    } else {
      parent.push(node);
    }
  }

  return old;
}

export async function syncCatalog(dir: string) {
  const tree = await updateCatalog(dir);
  const dist = path.join(dir, "catalog.md");
  const md = catalogToMd(tree);
  await fs.promises.writeFile(
    dist,
    prettier.format(md, { parser: "markdown", tabWidth: 2 })
  );
}
