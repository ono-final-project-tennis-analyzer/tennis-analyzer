import Layout from "../Layout/layout.component.tsx";
import {Button} from "@mantine/core";
import {useLogoutMutation} from "../../services/accounts.service.ts";
import {Route, Routes, useNavigate} from "react-router-dom";

export default function Home() {


    return (
        <Layout>
            <Routes>
                <Route path="/" element={<div>Home</div>}/>
                <Route path="/about" element={<div>About</div>}/>
            </Routes>
        </Layout>
    );
}
