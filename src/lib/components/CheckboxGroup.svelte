<!-- src/lib/components/CheckboxGroup.svelte -->
<script lang="ts">
    import type { CheckboxGroupProps, OptionPair } from '$lib/types.js';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        options,
        group = $bindable([]),
        columns = 2,
    } : CheckboxGroupProps = $props();

    let error = $derived(required && group.length === 0 ? error_msg : '');

    const columnClasses = {
        2: 'grid-cols-2',
        3: 'sm:grid-cols-3',
        4: 'md:grid-cols-4'
    };

    // Helper functions to handle both string and OptionPair types
    const getValue = (option: string | OptionPair): string => 
        typeof option === 'string' ? option : option.value;

    const getLabel = (option: string | OptionPair): string =>
        typeof option === 'string' ? option : option.label;
</script>

<fieldset class="form-field">
    <legend class="block text-sm font-medium text-gray-700">
        {label}
        {#if required}<span class="text-red-500">*</span>{/if}
    </legend>
    <div class="grid {columnClasses[columns]} gap-4">
        {#each options as option, index}
            <label for="{name}-{index}" class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="{name}-{index}"
                    bind:group={group}
                    value={getValue(option)}
                    autocomplete="off"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700">
                    {getLabel(option)}
                </span>
            </label>
        {/each}
    </div>
    {#if error}
        <p class="mt-1 text-sm text-red-600">
            {error}
        </p>
    {/if}
</fieldset>
