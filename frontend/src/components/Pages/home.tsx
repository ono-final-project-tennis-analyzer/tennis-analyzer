import Layout from "../layout.component.tsx";
import {Button} from "@mantine/core";
import {useLogoutMutation} from "../../services/accounts.service.ts";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const {mutate} = useLogoutMutation(() => {
        navigate("/login");
    });

    return (
        <Layout>
            <div>child component</div>
            <Button size="xl" onClick={mutate}>Logout</Button>
        </Layout>
    );
}
