import React from "react";
import styles from "./TennisPlaygroundLegend.module.css";

const TennisPlaygroundLegend: React.FC = () => {
  const legendItems = [
    {
      type: "forehand",
      label: "Forehand",
      icon: (
        <svg width="20" height="20">
          <polygon points="10,0 20,20 0,20" fill="green" />
        </svg>
      ),
    },
    {
      type: "backhand",
      label: "Backhand",
      icon: (
        <svg width="20" height="20">
          <rect x="0" y="0" width="20" height="20" fill="orange" />
        </svg>
      ),
    },
    {
      type: "volley",
      label: "Volley",
      icon: (
        <svg width="20" height="20">
          <circle cx="10" cy="10" r="10" fill="purple" />
        </svg>
      ),
    },
    {
      type: "smash",
      label: "Smash",
      icon: (
        <svg width="20" height="20">
          <polygon
            points="10,0 12,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 8,7"
            fill="red"
          />
        </svg>
      ),
    },
    {
      type: "slice",
      label: "Slice",
      icon: (
        <svg width="20" height="20">
          <polygon points="10,0 20,10 10,20 0,10" fill="teal" />
        </svg>
      ),
    },
  ];

  return (
    <ul className={styles.legend}>
      {legendItems.map((item) => (
        <li key={item.type} className={styles.legendItem}>
          {item.icon}
          <span className={styles.label}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default TennisPlaygroundLegend;
