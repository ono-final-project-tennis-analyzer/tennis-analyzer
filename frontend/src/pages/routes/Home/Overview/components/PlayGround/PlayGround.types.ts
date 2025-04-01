import { TennisPlaygroundMapPointType } from "@/components/tennis-playground-map/tennis-playground-map.component";
import { VideoEvent } from "@/@types/VideoEvent";

export interface Point {
  id: string;
  type: TennisPlaygroundMapPointType;
  x: number;
  y: number;
}

export interface PlayGroundProps {
  events?: VideoEvent[];
}
