<!-- src/lib/components/PasswordInput.svelte -->
<script lang="ts">
    import type { PasswordProps } from '$lib/types.js';
    import BaseInput from '$lib/components/BaseInput.svelte';

    let { 
        name,
        label = "Password",
        placeholder = '',
        value = $bindable(''),
        tooltip = 'Enter your password',
    } : PasswordProps = $props();
</script>

<BaseInput
    name={name}
    label={label}
    type='password'
    required={true}
    placeholder={placeholder}
    bind:value={value}
    autocomplete='off'
    validator={undefined}
    tooltip={tooltip}
/>