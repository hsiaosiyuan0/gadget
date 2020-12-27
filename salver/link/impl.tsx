import React, { cloneElement, useState, useEffect, useRef } from "react";
import { Route, hrefToUrl, isHrefEqual, Href } from "../app/util";
import { EventAfterRouteChanged, getCurRoute, pushHistory } from "../app";
import { classNames, packToArray, on, off } from "../../shared";
import { ILink, unifyHref, LinkPassThrough, LinkPass } from "./type";

function unifyChildren(
  children: React.ReactNode,
  active: boolean,
  href?: Href
) {
  return packToArray(children).map((c, i) => {
    if (typeof c !== "function") return c;
    const param: LinkPassThrough = { active, href };
    return cloneElement((c as LinkPass)(param), { key: i });
  });
}

function classNameList(
  active: boolean,
  className = "",
  activeClassName = "active"
) {
  const classList = className
    .split(/\s+/g)
    .filter((c) => !!c && c !== activeClassName);
  if (active) classList.push(activeClassName);
  return classList;
}

export const Link: ILink = (props) => {
  const [href, setHref] = useState(unifyHref(props.href));
  const [active, setActive] = useState(isHrefEqual(href, getCurRoute().href));
  const [children, setChildren] = useState<Array<React.ReactNode>>(
    unifyChildren(props.children, active, href)
  );
  const elem = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const href = unifyHref(props.href);
    setHref(href);
    setActive(!!href && isHrefEqual(href, getCurRoute().href));

    function handleRouteChanged(routeState: Route) {
      if (href) setActive(isHrefEqual(href, routeState.href));
    }

    on(EventAfterRouteChanged, handleRouteChanged);
    return () => {
      off(EventAfterRouteChanged, handleRouteChanged);
    };
  }, [props.href]);

  useEffect(() => {
    if (elem.current) {
      elem.current.className = classNames(
        classNameList(active, props.html?.className, props.activeClassName)
      );
    }
  }, [props.html?.className, active]);

  useEffect(() => {
    setChildren(unifyChildren(props.children, active, href));
  }, [props.children, active, href]);

  return (
    <a
      {...props.html}
      ref={elem}
      href={href && hrefToUrl(href, false)}
      onClick={(evt) => {
        if (props.html?.onClick) {
          props.html.onClick(evt);
        }
        if (props.href) {
          pushHistory(props.href);
        }
        evt.preventDefault();
      }}
    >
      {children}
    </a>
  );
};
