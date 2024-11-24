import { Stack, TextInput, PasswordInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { LoginFormValues } from "../../validation/loginSchema";

interface AuthFormProps {
  form: UseFormReturnType<LoginFormValues>;
}

export default function AuthForm({ form }: AuthFormProps) {
  return (
    <Stack>
      <TextInput
        required
        label="Email"
        placeholder="Your email"
        {...form.getInputProps("email")}
        radius="md"
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Your password"
        {...form.getInputProps("password")}
        radius="md"
      />
    </Stack>
  );
}
