// src/stories/EmailInput.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import type { SvelteComponent } from 'svelte';
import EmailInput from '$lib/components/EmailInput.svelte';
import Form from '$lib/components/Form.svelte';

const meta = {
  title: 'Forms/EmailInput',
  component: EmailInput as unknown as typeof SvelteComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      Component: Form as unknown as typeof SvelteComponent,
      props: {
        on_submit: () => console.log('Form submitted'),
        children: () => story
      }
    })
  ],
  parameters: {
    docs: {
      source: {
        transform: (code: string, storyContext: any) => {
          const props = storyContext.args;
          const propsString = Object.entries(props)
            .map(([key, value]) => {
              if (typeof value === 'string') return `${key}="${value}"`;
              if (typeof value === 'boolean' && value) return key;
              if (typeof value === 'boolean' && !value) return '';
              return `${key}={${value}}`;
            })
            .filter(Boolean)
            .join('\n  ');
          
          return `<EmailInput\n  ${propsString}\n/>`;
        }
      }
    }
  },
  argTypes: {
    name: { 
      control: 'text',
      description: 'Unique identifier for the input field'
    },
    label: { 
      control: 'text',
      description: 'Label text displayed above the input'
    },
    required: { 
      control: 'boolean',
      description: 'Whether the field is required'
    },
    placeholder: { 
      control: 'text',
      description: 'Placeholder text for the input'
    },
    error_msg: { 
      control: 'text',
      description: 'Custom error message for required validation'
    },
    invalid_msg: { 
      control: 'text',
      description: 'Custom error message for invalid email format'
    }
  }
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email'
  }
};

export const Required: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    error_msg: 'Email address is required'
  }
};

export const CustomValidation: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    error_msg: 'Please provide your email address',
    invalid_msg: 'Please enter a valid email address'
  }
};

export const WithinFormExample: Story = {
  decorators: [
    (story) => ({
      Component: Form as unknown as typeof SvelteComponent,
      props: {
        title: 'Contact Form',
        description: 'Please provide your contact information',
        style: 'bordered',
        submit_label: 'Send Message',
        on_submit: () => console.log('Form submitted'),
        children: () => story
      }
    })
  ],
  args: {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true
  }
};