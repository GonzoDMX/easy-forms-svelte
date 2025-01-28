<!-- src/lib/components/EmailInput.svelte -->
<script lang="ts">
    import type { InputProps} from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    let { 
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        validator =/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        tooltip = 'Please enter a valid email address (e.g., user@example.com)'
    } : InputProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='email'
    required={required}
    placeholder={placeholder}
    bind:value={value}
    autocomplete='email'
    validator={validator}
    tooltip={tooltip}
/>