import React from "react";
import type {
  HTMLAttributes,
  ScriptHTMLAttributes,
  LinkHTMLAttributes,
} from "react";
import { useModule } from "../config";

export type HtmlComponent = React.FC<HTMLAttributes<HTMLHtmlElement>>;

export type ScriptList = Array<string | ScriptHTMLAttributes<{}>>;
export type StyleList = Array<string | LinkHTMLAttributes<{}>>;

export interface HtmlProps {
  scripts: ScriptList;
  styles: StyleList;
}

export const Scripts = ({ list }: { list: ScriptList }) => {
  return (
    <>
      {list.map((props, i) => {
        let p = props as ScriptHTMLAttributes<{}>;
        const content = typeof p.children === "string" ? p.children : "";
        if (content) {
          delete p.children;
          return (
            <script
              {...props}
              key={i}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          );
        }

        if (typeof props === "string") {
          p = { src: props };
        }
        return <script crossOrigin="anonymous" key={p.src} {...p}></script>;
      })}
    </>
  );
};

export const Styles = ({ list }: { list: StyleList }) => {
  return (
    <>
      {list.map((props) => {
        let p = props as LinkHTMLAttributes<{}>;
        if (typeof props === "string") {
          p = { href: props };
        }
        return <link rel="stylesheet" key={p.href} {...p}></link>;
      })}
    </>
  );
};

export class Html extends React.Component<React.PropsWithChildren<HtmlProps>> {
  static doctype = "<!DOCTYPE html>";

  render() {
    const { styles, scripts, children } = this.props;

    return (
      <html>
        <head>
          <title>__title__</title>
          <Styles list={styles} />
        </head>
        {children}
        <Scripts list={scripts} />
      </html>
    );
  }
}

useModule("HTML", Html);
