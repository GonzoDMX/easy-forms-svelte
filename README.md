# easy-forms-svelte

Easy to use form components for Svelte 5 with TypeScript support.
This library prioritizes simplicity over flexibility. The goal is to make forms easy to implement and reduce repeated boiler plate code. For convenience some built-in validators are included for handling standard HTML <input> types.

## Installation

```bash
npm install easy-forms-svelte
```

## Usage

```svelte
<script lang="ts">
  import { Form, TextInput } from 'easy-forms-svelte';

  let email = $state('');
  
  function handleSubmit(event: SubmitEvent) {
    // Handle form submission
  }
</script>

<Form on_submit={handleSubmit}>
  <TextInput
    name="email"
    type="email"
    label="Email"
    bind:value={email}
    required
  />
</Form>
```

## Components

- Form - Base form container
- TextInput - Text, email, URL, tel inputs
- NumberInput - Numeric input with optional formatting
- MultilineTextInput - Textarea with auto-resize
- DateInput - Date picker
- DateRangeInput - Date range selector
- CheckboxGroup - Group of checkboxes
- ConsentCheckbox - Single checkbox with text
- DropdownSelect - Select dropdown

## Development

```bash
pnpm install
pnpm run storybook
```
