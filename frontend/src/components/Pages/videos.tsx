import {Outlet} from "react-router-dom";
import {DropzoneComponent} from "../Dashboard/Dropzone/DropzoneComponent.tsx";import {VideoTable} from "../videos/VideoTable.tsx";
export const Videos = () => {

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
        }}>
            <DropzoneComponent/>
            <VideoTable data={[{
                id: "1",
                name: "Video 1",
                date: "2021-09-01",
                status: "Processed"
            }, {
                id: "2",
                name: "Video 2",
                date: "2021-09-02",
                status: "Processing"
            }, {
                id: "3",
                name: "Video 3",
                date: "2021-09-03",
                status: "Uploaded"
            }]}/>
            <Outlet/>
        </div>
    )
}