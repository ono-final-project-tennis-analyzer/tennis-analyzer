import { Avatar, Menu, rem } from "@mantine/core";
import React, { useMemo } from "react";
import { IconDoorExit } from "@tabler/icons-react";
import clsx from "clsx";
import Styles from "./UserMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "@/services/accounts.service.ts";

interface Props {
  className?: string;
}

const UserMenu: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const getUser = useMeQuery();
  const { mutate: logout } = useLogoutMutation(() => {
    navigate("/login");
  });

  const initials = useMemo(() => {
    return (getUser.data?.username as string)
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [getUser]);

  return (
    <Menu>
      <Menu.Target>
        <Avatar
          alt={`${getUser.data?.username}'s avatar`}
          color="blue"
          radius="xl"
          className={clsx(Styles.avatar, className)}
        >
          {initials}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Hello, {getUser.data?.username} 👋</Menu.Label>
        <div className={Styles.info}>
          <small>{getUser.data?.email}</small>
        </div>
        <Menu.Divider />
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          onClick={() => logout()}
          leftSection={
            <IconDoorExit
              color="red"
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
