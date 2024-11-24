import { TextInput, PasswordInput, Checkbox, Stack } from '@mantine/core';
import React from 'react';

interface SignupFormProps {
  form: any;
}

export default function SignupForm({ form }: SignupFormProps) {
  return (
    <Stack>
      <TextInput
        required
        label="Email"
        placeholder="Your email"
        {...form.getInputProps('email')}
        radius="md"
      />
      <TextInput
        required
        label="Username"
        placeholder="Your username"
        {...form.getInputProps('username')}
        radius="md"
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Your password"
        {...form.getInputProps('password')}
        radius="md"
      />
      <Checkbox
        required
        label="I accept terms and conditions"
        {...form.getInputProps('terms', { type: 'checkbox' })}
      />
    </Stack>
  );
}
