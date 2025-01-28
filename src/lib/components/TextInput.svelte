<!-- src/lib/components/TextInput.svelte -->
<script lang="ts">
    import type { TextInputProps } from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    let { 
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        validator,
        autocomplete = 'off',
        tooltip
    } : TextInputProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='text'
    required={required}
    placeholder={placeholder}
    bind:value={value}
    autocomplete={autocomplete}
    validator={validator}
    tooltip={tooltip}
/>