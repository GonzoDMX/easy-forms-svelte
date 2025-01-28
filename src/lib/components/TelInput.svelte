<!-- src/lib/components/TelInput.svelte -->
<script lang="ts">
    import type { InputProps } from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    let {
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        validator = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        tooltip = 'Please enter a valid phone number (e.g., +1 (555) 555-5555)'
    } : InputProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='tel'
    required={required}
    placeholder={placeholder}
    bind:value={value}
    autocomplete='tel'
    validator={validator}
    tooltip={tooltip}
/>