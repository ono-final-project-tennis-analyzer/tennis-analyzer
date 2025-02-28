import { Group, Button, Anchor } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useRedirectIfLoggedIn } from "../hooks/useRedirectIfLoggedIn.ts";
import React from "react";
import AuthForm from "./components/AuthForm";
import { LoginFormValues, loginSchema } from "./validation/loginSchema.ts";
import AuthWrapper from "../components/AuthWrapper";
import { useLoginMutation } from "@/services/accounts.service.ts";
import { TennisPlaygroundMap } from "@/components/tennis-playground-map/tennis-playground-map.component.tsx";

export default function Login() {
  const navigate = useNavigate();
  const { isLoading } = useRedirectIfLoggedIn();

  const onSuccess = () => {
    navigate("/");
  };

  const loginMutation = useLoginMutation(onSuccess);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = async () => {
    const validationErrors = form.validate();
    if (Object.keys(validationErrors.errors).length > 0) {
      console.error(validationErrors);
      return;
    }

    try {
      const { email, password } = form.values;
      loginMutation.mutate({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthWrapper title="Welcome to Tennis App, login with your account">
      <form onSubmit={form.onSubmit(() => handleSubmit())}>
        <AuthForm form={form} />
        <Group p="apart" mt="xl">
          <Anchor to="/signup" size="xs" component={Link}>
            Don't have an account? Register
          </Anchor>
          <Button type="submit" radius="xl">
            Login
          </Button>
        </Group>
      </form>
      <TennisPlaygroundMap
        points={[
          { x: -0.7, y: -0.9 },
          { x: 0.5, y: 0.5 },
        ]}
      />
    </AuthWrapper>
  );
}
