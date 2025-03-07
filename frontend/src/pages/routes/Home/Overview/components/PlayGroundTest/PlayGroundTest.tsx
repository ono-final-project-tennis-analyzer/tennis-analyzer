import { TennisPlaygroundMap, TennisPlaygroundMapPointType } from "@/components/tennis-playground-map/tennis-playground-map.component";
import { useEffect, useState, useRef } from "react";

export default function PlayGroundTest() {
  // Get the height and width of the containing div
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  const [points, setPoints] = useState([{ id:"1", type:TennisPlaygroundMapPointType.BALL, x: 0.1, y: 0.2 },{ id:"2", type:TennisPlaygroundMapPointType.PLAYER, x: 0.5, y: 0.5 }]);
  const [impactPoints, setImpactPoints] = useState<any[]>([]);
  const ballDirectionRef = useRef(1); // 1 = going to player2, -1 = going to player1
  const ballProgressRef = useRef(0); // 0 to 1, represents progress of current shot
  const lastHitTimeRef = useRef(Date.now());
  const rallyCountRef = useRef(0);

  useEffect(() => {
    // Create new impact points at random intervals
    const impactInterval = setInterval(() => {
      // Remove impacts older than 1 second
      setImpactPoints(prev => prev.filter(impact => Date.now() - impact.createdAt < 1000));
    }, 50);

    const interval = setInterval(() => {
      setPoints(currentPoints => {
        // Calculate ball trajectory
        const now = Date.now();
        const timeSinceLastHit = now - lastHitTimeRef.current;
        const shotDuration = 1000; // Time for ball to travel from one player to another
        
        // Update ball progress
        ballProgressRef.current = Math.min(1, timeSinceLastHit / shotDuration);
        
        // When ball reaches destination
        if (ballProgressRef.current >= 1) {
          // Switch direction
          ballDirectionRef.current *= -1;
          lastHitTimeRef.current = now;
          ballProgressRef.current = 0;
          rallyCountRef.current++;
          
          // Create player impact
          const playerId = ballDirectionRef.current === 1 ? "player1" : "player2";
          const playerX = ballDirectionRef.current === 1 ? -0.4 : 0.4;
          const playerY = ballDirectionRef.current === 1 ? 0.7 : -0.7;
          
          const newPlayerImpact = {
            id: `playerImpact_${Date.now()}`,
            type: TennisPlaygroundMapPointType.PLAYER_IMPACT,
            x: playerX,
            y: playerY,
            createdAt: Date.now(),
          };
          
          // Create ground impact in opposite court
          const groundX = (Math.random() * 0.5 - 0.25);
          const groundY = ballDirectionRef.current === 1 ? -0.4 : 0.4;
          
          const newGroundImpact = {
            id: `groundImpact_${Date.now()}`,
            type: TennisPlaygroundMapPointType.GROUND_IMPACT,
            x: groundX,
            y: groundY,
            createdAt: Date.now(),
          };
          
          setImpactPoints(prev => [...prev, newPlayerImpact, newGroundImpact]);
        }
        
        // Calculate ball position along arc
        // Start position (near player who hit the ball)
        const startX = ballDirectionRef.current === 1 ? -0.4 : 0.4;
        const startY = ballDirectionRef.current === 1 ? 0.7 : -0.7;
        
        // End position (opposite court)
        const endX = (Math.random() * 0.5 - 0.25); // Random position within court width
        const endY = ballDirectionRef.current === 1 ? -0.4 : 0.4; // Opposite court
        
        // Calculate current position with arc
        const progress = ballProgressRef.current;
        const ballX = startX + (endX - startX) * progress;
        // Add arc to ball height (parabolic trajectory)
        const ballY = startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * 0.5;
        
        // Ball
        const ball = {
          id: "ball",
          type: TennisPlaygroundMapPointType.BALL,
          x: ballX,
          y: ballY
        };

        // Two players moving to intercept the ball
        const player1 = {
          id: "player1", 
          type: TennisPlaygroundMapPointType.PLAYER,
          x: Math.sin(now / 2000) * 0.2 - 0.4, // Player 1 moves left side
          y: 0.7 // Player 1 at bottom
        };

        const player2 = {
          id: "player2",
          type: TennisPlaygroundMapPointType.PLAYER, 
          x: Math.sin(now / 2000) * 0.2 + 0.4, // Player 2 moves right side
          y: -0.7 // Player 2 at top
        };
 
        return [ball, player1, player2];
      });
    }, 16); // ~60fps for smoother animation

    return () => {
      clearInterval(interval);
      clearInterval(impactInterval);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <TennisPlaygroundMap 
        scale={Math.min(
        (document.getElementById('tennis-playground-map')?.parentElement?.clientWidth ?? 0) / 150 || 3,
          (document.getElementById('tennis-playground-map')?.parentElement?.clientHeight ?? 0) / 300 || 3
        ) ?? 1} 
        playerScale={4} 
        points={[...points, ...impactPoints]} 
      />
    </div>
  );
}
