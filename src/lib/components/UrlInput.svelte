<!-- src/lib/components/UrlInput.svelte -->
<script lang="ts">
    import type { InputProps } from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    let { 
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        validator = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        tooltip = 'Please enter a valid URL (e.g., https://example.com)',
    } : InputProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='url'
    required={required}
    placeholder={placeholder}
    bind:value={value}
    autocomplete='url'
    validator={validator}
    tooltip={tooltip}
/>