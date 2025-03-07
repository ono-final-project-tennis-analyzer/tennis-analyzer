import { Card } from "@mantine/core";
import Video from "../../Video";

export default function VideoPlayer() {
  return <Card style={{
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: '15px',
  }}>
   <iframe 
     height="100%" 
     src="https://www.youtube.com/embed/B9synWjqBn8?si=ofPiF34D3TplKqzy" 
     frameBorder="0" 
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
     referrerPolicy="strict-origin-when-cross-origin" 
     allowFullScreen
   />
  </Card>;
}

