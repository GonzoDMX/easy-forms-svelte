<!-- src/lib/components/DropdownSelect.svelte -->
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
    }: DropdownSelectProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let selectedOption: string | OptionPair = $state('');
    const isError = formStore.isFieldInError(name);

    let isOpen = $state(false);

    // Helper functions
    const getValue = (option: string | OptionPair): string =>
        typeof option === 'string' ? option : option.value;

    const getLabel = (option: string | OptionPair): string =>
        typeof option === 'string' ? option : option.label;

    function validateInput() {
        formStore.validateField(name, value);
    }

    function handleSelection(option: string | OptionPair) {
        formStore.clearFieldError(name);
        selectedOption = option;
        value = getValue(option);
        isOpen = false;
        validateInput();
    }

    $effect(() => {
        validateInput();
    });

    onMount(() => {
        if (!value) {
            if (selected_value) {
                selectedOption = selected_value;
                value = getValue(selected_value);
            }
            else if (placeholder && placeholder !== '') {
                value = '';
            }
            else if (options.length > 0) {
                selectedOption = options[0];
                value = getValue(options[0]);
            }
        }
    });

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function closeDropdown() {
        isOpen = false;
    }

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
                   'bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <div class="relative">
        <!-- Display current value or placeholder -->
        <button
            id={name}
            type="button"
            class="flex items-center justify-between text-left w-full rounded-md shadow-sm px-3 py-2 border cursor-pointer {inputClasses}
                    {value === '' ? 'text-gray-400' : 'text-black'}"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onclick={toggleDropdown}
            onblur={(e) => {
                setTimeout(closeDropdown, 100);
            }}
            onkeydown={(e) => e.key === 'Enter' && toggleDropdown()}
            title={tooltip ?? undefined}
        >
            <span class="text-left truncate">{value ? getLabel(selectedOption) : placeholder}</span>
            <svg
                class="w-4 h-4 text-gray-400 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown menu -->
        {#if isOpen}
            <ul
                class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto w-full"
            >
                {#each options as option}
                <li role="option" class="hover:bg-indigo-500" aria-selected={getValue(option) === value}
                >
                    <button
                        type="button"
                        class="block w-full text-left px-3 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                        onclick={() => handleSelection(option)}
                        onkeydown={(e) => e.key === 'Enter' && handleSelection(option)}
                    >
                        {getLabel(option)}
                    </button>
                </li>
                {/each}
            </ul>
        {/if}
    </div>
</FormField>
