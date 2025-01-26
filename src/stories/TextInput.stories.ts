// src/stories/TextInput.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import type { SvelteComponent } from 'svelte';
import TextInput from '$lib/components/TextInput.svelte';

const meta = {
  title: 'Forms/TextInput',
  component: TextInput as unknown as typeof SvelteComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'url', 'tel', 'country', 'password']
    },
    required: { control: 'boolean' },
    placeholder: { control: 'text' }
  }
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true
  }
};