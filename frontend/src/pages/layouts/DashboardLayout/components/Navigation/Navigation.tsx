import { IconGauge, IconVideo } from "@tabler/icons-react";
import classes from "./Navigation.module.css";
import React from "react";
import clsx from "clsx";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export interface NavigationItem {
  label: string;
  icon: React.FC<any>;
  link: string;
  links?: NavigationItem[];
  initiallyOpened?: boolean;
}

const items: NavigationItem[] = [
  { label: "Overview", icon: IconGauge, link: "/" },
  { label: "Videos", icon: IconVideo, link: "/videos" },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className={classes.navbar} style={{padding: 0}}>
      <div className={classes.navbarMain}>
        {items.map((item) => (
          <Link
            className={clsx(classes.link, {
              [classes.active]: item.link === pathname,
            })}
            data-active={item.link === pathname}
            to={item.link}
            key={item.label}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
