<!-- src/lib/components/CheckboxGroup.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { CheckboxGroupProps, OptionPair, FormStore } from '$lib/types.js';

    let {
        name,
        label,
        required = false,
        options,
        group = $bindable([]),
        columns = 2,
    } : CheckboxGroupProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    const isError = formStore.isFieldInError(name);

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

    function validateInput() {
        formStore.validateField(name, group);
    }

    function handleInput() {
        formStore.clearFieldError(name);
        validateInput();
    }

    $effect(() => {
        validateInput();
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<fieldset class="form-field">
    <legend class="block text-sm mb-1 font-medium text-gray-700">
        {label}
        {#if required}<span class="text-red-500">*</span>{/if}
    </legend>
    <div class="grid {columnClasses[columns]} gap-4 rounded-md p-2 {inputClasses}">
        {#each options as option, index}
            <label for="{name}-{index}" class="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="{name}-{index}"
                    bind:group={group}
                    value={getValue(option)}
                    onclick={handleInput}
                    autocomplete="off"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700">
                    {getLabel(option)}
                </span>
            </label>
        {/each}
    </div>
</fieldset>
