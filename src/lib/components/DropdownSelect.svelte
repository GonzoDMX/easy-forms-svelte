<!-- src/lib/components/DropdownSelect.svelte -->
<script lang="ts">
    import type { DropdownSelectProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        options,
        value = $bindable(''),
        selected_value, // TODO implement this, if defined it overrdes placeholder
        placeholder,
    } : DropdownSelectProps = $props();

    let error = $derived(required && !value ? error_msg : '');
</script>

<FormField {name} {label} {error}>
    <select
        id={name}
        {name}
        {required}
        bind:value={value}
        class="block w-full rounded-md border-gray-300 shadow-sm
               focus:border-indigo-500 focus:ring-indigo-500"
    >
    {#if placeholder && !selected_value}
        <option value="" disabled selected hidden>{placeholder}</option>
    {/if}
    {#each options as option}
        {#if selected_value === option}
            <option value={option} selected>{option}</option>
        {:else}
            <option value={option}>{option}</option>
        {/if}
    {/each}
    </select>
</FormField>