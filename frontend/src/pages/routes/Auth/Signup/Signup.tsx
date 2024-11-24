import { Group, Button, Anchor } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../../services/accounts.service.ts";
import { useRedirectIfLoggedIn } from "../hooks/useRedirectIfLoggedIn.ts";
import React from "react";
import SignupForm from "./components/SignupForm";
import AuthWrapper from "../components/AuthWrapper";
import { SignupFormValues, signupSchema } from "./validations/signupSchema.ts";

export default function Signup() {
  const navigate = useNavigate();
  const { isLoading } = useRedirectIfLoggedIn();

  const onSuccess = () => {
    navigate("/");
  };

  const registerMutation = useRegisterMutation(onSuccess);

  const form = useForm<SignupFormValues>({
    initialValues: {
      email: "",
      username: "",
      password: "",
      terms: false,
    },
    validate: zodResolver(signupSchema),
  });

  const handleSubmit = async () => {
    try {
      const { email, username, password } = form.values;
      registerMutation.mutate({ email, username, password });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthWrapper title="Welcome to Tennis App, create your account">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SignupForm form={form} />
        <Group p="apart" mt="xl">
          <Anchor to="/login" size="xs" component={Link}>
            Already have an account? Login
          </Anchor>
          <Button type="submit" radius="xl">
            Sign Up
          </Button>
        </Group>
      </form>
    </AuthWrapper>
  );
}
