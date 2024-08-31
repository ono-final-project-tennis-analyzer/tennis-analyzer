import {AppShell, Burger, Group, Skeleton, Text, Avatar, Button} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useLogoutMutation, useMeQuery} from "../../services/accounts.service.ts";
import {useNavigate} from "react-router-dom";
import {Navbar} from "./Navbar.component.tsx";

type LayoutProps = {
    children: React.ReactNode;
}


export default function Layout({children}: LayoutProps) {
    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();
    const getUser = useMeQuery();
    const {mutate} = useLogoutMutation(() => {
        navigate("/login");
    });

    const AvatarLogo = () => {
        const name = (getUser.data?.username as string)
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
        return <Avatar color={"blue"}>{name}</Avatar>
    }

    return (<AppShell
        header={{height: 60}}
        navbar={{width: 200, breakpoint: 'sm', collapsed: {mobile: !opened}}}
        padding="md"
    >
        <AppShell.Header>
            <Group justify="space-between" h="100%" px="md">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    <AvatarLogo/>
                    <Text>{getUser.data?.username}</Text>
                </Group>
                <Button onClick={mutate}>Logout</Button>
            </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
            <Navbar/>
        </AppShell.Navbar>
        <AppShell.Main>
            {children}
        </AppShell.Main>
    </AppShell>);
}