<!-- src/lib/components/DropdownSelect.svelte -->
<script lang="ts">
    import type { DropdownSelectProps, OptionPair } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        options,
        value = $bindable(''),
        selected_value,
        placeholder,
    } : DropdownSelectProps = $props();

    let error = $derived(required && !value ? error_msg : '');

    // Helper functions to handle both string and OptionPair types
    const getValue = (option: string | OptionPair): string => 
        typeof option === 'string' ? option : option.value;
        
    const getLabel = (option: string | OptionPair): string =>
        typeof option === 'string' ? option : option.label;
</script>

<FormField {name} {label} {required} {error}>
    {#if placeholder && !selected_value}
        <select
            id={name}
            {name}
            {required}
            bind:value={value}
            class="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500"
            data-placeholder="true"
        >
        <option value="" disabled selected hidden>{placeholder}</option>
        {#each options as option}
            {#if selected_value === option}
                <option value={getValue(option)} selected>{getLabel(option)}</option>
            {:else}
                <option value={getValue(option)}>{getLabel(option)}</option>
            {/if}
        {/each}
        </select>
    {:else}
        <select
            id={name}
            {name}
            {required}
            bind:value={value}
            class="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500"
        >
        {#each options as option}
            {#if selected_value === option}
                <option value={getValue(option)} selected>{getLabel(option)}</option>
            {:else}
                <option value={getValue(option)}>{getLabel(option)}</option>
            {/if}
        {/each}
        </select>
    {/if}
</FormField>
