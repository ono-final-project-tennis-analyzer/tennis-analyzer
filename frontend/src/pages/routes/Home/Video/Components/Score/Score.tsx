import { Card, Button } from "@mantine/core";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimateNumber from "./AnimateNumber";

export interface ScoreProps {
  Player1Score: number;
  Player2Score: number;
}



export default function Score({ Player1Score, Player2Score }: ScoreProps) {
  const [score1, setScore1] = useState(Player1Score);
  const [score2, setScore2] = useState(Player2Score);

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
    
        
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2px" }}>
          <Button onClick={() => setScore1(score1 + 15)}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>+</span>
          </Button>  
          <AnimateNumber score={score1} /> 
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>:</span>
          <AnimateNumber score={score2} /> 
          <Button onClick={() => setScore2(score2 + 15)}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>+</span>
          </Button>
        </div>
      </div>
     
    </Card>
  );
}
