import {AppShell, Burger, Group, Skeleton} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

type LayoutProps = {
    children: React.ReactNode;
}

function MantineLogo(props: { size: number }) {
    return null;
}

export default function Layout({ children }: LayoutProps) {
     const [opened, { toggle }] = useDisclosure();
  return (    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
                  Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
      {children}
      </AppShell.Main>
      </AppShell>);
}