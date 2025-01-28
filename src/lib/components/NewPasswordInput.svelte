<!-- src/lib/components/PasswordInput.svelte -->
<script lang="ts">
    import type { InputProps } from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    // TODO Make this a two field component with 'New Password' and 'Confirm Password'

    let { 
        name,
        label = "New Password",
        required = false,
        placeholder = '',
        value = $bindable(''),
        // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 non-alphanumeric symbol
        validator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{12,}$/,
        tooltip = 'Enter a password with at least 12 characters (1 uppercase, 1 lowercase, 1 number, and 1 symbol)',
    } : InputProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='password'
    required={required}
    placeholder={placeholder}
    bind:value={value}
    autocomplete='off'
    validator={validator}
    tooltip={tooltip}
/>