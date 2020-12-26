import React from "react";
import { Href } from "../app/util";

export type ILink = React.FC<LinkProps>;

export interface LinkProps {
  href: string | Href;

  activeClassName?: string;

  // users could hook their own business logic via the`onClick` property.
  //
  // `Link` will take the whole control of the `onClick` of the underlying Anchor
  // element, it will call the user specified `onClick` property first if the
  // property is present, after that it will either loads the page which is
  // associated with the route of the `href` or just redirects to the external
  // sites if the `href` is not a local one.
  //
  // so here user specified `onClick` property is working as a opt-in parts and cannot
  // cancel the running of the further internal subroutine.
  //
  // if users' requirements is needed to entirely replace the internal logic then
  // using a fresh custom Anchor element with the `userRouter` api is preferred
  onClick?: (link: ILink) => void;

  replace?: boolean;
  html?: React.HTMLAttributes<HTMLAnchorElement>;
}

export interface LinkPassThrough {
  active: boolean;
  href?: Href;
}

// users could provide a function with type `LinkPass` as the children of
// `Link`, the function can accept a param with type `LinkPassThrough` and
// return their custom element
export type LinkPass = (params: LinkPassThrough) => React.ReactElement;

// @internal
export function unifyHref(href: string | Href): Href {
  if (typeof href === "string") {
    return {
      pathname: href,
    };
  }
  return href;
}
