import React, { useEffect } from "react";
import styles from "@/components/header/index.pure.scss";

export function scrollToAnchor(hash: string, offset: number) {
  const id = decodeURIComponent(hash).replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    var position = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo(0, position - offset);
  }
}

let offset = 89;
function hackClick(mouseEvent: MouseEvent) {
  const { hash, pathname } = (mouseEvent.target as any) as Location;
  if (hash) {
    if (window.location.pathname === pathname) {
      mouseEvent.preventDefault();
      if (window.location.hash === hash) {
        scrollToAnchor(hash, offset);
      } else {
        window.location.hash = hash;
      }
    }
  }
}

export interface HeaderProps {
  title: string;
}

export function Header(props: HeaderProps) {
  useEffect(() => {
    function handleHashChange() {
      scrollToAnchor(window.location.hash, offset);
    }

    document.addEventListener("click", hackClick);
    window.addEventListener("hashchange", handleHashChange);
    () => {
      document.removeEventListener("click", hackClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  });

  return (
    <div className={styles.header}>
      <div className={styles.title}>{props.title}</div>
    </div>
  );
}
