<!-- src/lib/components/DropdownClassic.svelte -->
<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { DropdownSelectProps, OptionPair, FormStore } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        options,
        value = $bindable(''),
        selected_value = null,
        placeholder = null,
        tooltip
    } : DropdownSelectProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    const isError = formStore.isFieldInError(name);

    // Helper functions to handle both string and OptionPair types
    const getValue = (option: string | OptionPair): string => 
        typeof option === 'string' ? option : option.value;
        
    const getLabel = (option: string | OptionPair): string =>
        typeof option === 'string' ? option : option.label;

    function validateInput() {
        formStore.validateField(name, value);
    }

    function handleInput() {
        formStore.clearFieldError(name);
        validateInput();
    }

    $effect(() => {
        validateInput();
    });

    // Initialize the value once on mount
    onMount(() => {
        if (!value) {
            value = selected_value
                ? getValue(selected_value)
                : placeholder
                ? ''
                : options.length > 0
                ? getValue(options[0])
                : '';
        }
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
                   'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    {#if placeholder && placeholder.trim().length > 0 && !selected_value}
        <select
            id={name}
            {name}
            {required}
            bind:value={value}
            oninput={handleInput}
            class="block w-full rounded-md shadow-sm {inputClasses}
                   {value ? '' : 'text-gray-400'}"
            title={tooltip ?? undefined}
            data-placeholder="true"
        >
        <option value="" class="text-gray-400" disabled selected hidden>{placeholder}</option>
        {#each options as option}
            <option value={getValue(option)}>{getLabel(option)}</option>
        {/each}
        </select>
    {:else}
        <select
            id={name}
            {name}
            {required}
            bind:value={value}
            oninput={handleInput}
            class="block w-full rounded-md shadow-sm {inputClasses}"
            title={tooltip ?? undefined}
        >
        {#each options as option}
            <option value={getValue(option)}>{getLabel(option)}</option>
        {/each}
        </select>
    {/if}
</FormField>
