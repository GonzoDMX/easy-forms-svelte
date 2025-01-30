<!-- src/lib/components/DropdownSelect.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { DropdownInputProps, FormStore, OptionPair } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let { 
        name,
        label,
        required = false,
        list_only = true,
        placeholder = '',
        value = $bindable(''),
        tooltip = '',
        validator,
        options,
        autocomplete = 'off'
    } : DropdownInputProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    // Convert options to normalized format
    const normalizedOptions = $state(options.map(opt => 
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    ));

    let filteredOptions = $state<OptionPair[]>([]);
    let showWarning = $state(false);
    let isOpen = $state(false);
    let inputValue = $state('');
    const isError = formStore.isFieldInError(name);

    function processInput(input: string) {
        // Show dropdown if we have input
        isOpen = input.length >= 1;
        
        if (input.length >= 1) {
            const lowercaseInput = input.toLowerCase();
            
            // Filter options that match the input
            const filtered = normalizedOptions.filter(({ label }) => 
                label.toLowerCase().includes(lowercaseInput)
            );
            
            // Sort to prioritize options that start with the input
            filteredOptions = filtered.sort((a, b) => {
                const aStartsWith = a.label.toLowerCase().startsWith(lowercaseInput);
                const bStartsWith = b.label.toLowerCase().startsWith(lowercaseInput);
                
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.label.localeCompare(b.label);
            });
        } else {
            filteredOptions = [];
        }

        // Handle validation
        if (list_only) {
            // If list_only is true, input must match an option exactly
            const matchingOption = normalizedOptions.find(
                opt => opt.label.toLowerCase() === input.toLowerCase()
            );
            
            if (matchingOption) {
                handleSelection(matchingOption);
            } else {
                showWarning = input.length > 0;
                if (!input) {
                    value = '';
                    formStore.clearFieldError(name);
                    validateInput();
                }
            }
        } else {
            // If list_only is false, just validate against the validator if provided
            showWarning = false;
            if (!input) {
                value = '';
            } else {
                value = input;
            }
            formStore.clearFieldError(name);
            validateInput();
        }
    }

    function handleInput(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        inputValue = input;
        processInput(input);
    }

    function handleAutoFill() {
        requestAnimationFrame(() => {
            const input = (document.getElementById(name) as HTMLInputElement)?.value;
            if (input && input !== inputValue) {
                inputValue = input;
                processInput(input);
            }
        });
    }

    function handleSelection(option: OptionPair) {
        inputValue = option.label;
        value = option.value;
        isOpen = false;
        showWarning = false;
        formStore.clearFieldError(name);
        validateInput();
    }

    function validateInput() {
        const isEmpty = !value || value.trim() === '';
        if (validator) {
            showWarning = !isEmpty && !validator.test(value);
        }
        formStore.validateField(name, value, validator);
    }

    function handleBlur() {
        setTimeout(() => {
            isOpen = false;
            
            if (list_only) {
                // If list_only, ensure display shows correct label for selected value
                const option = normalizedOptions.find(opt => opt.value === value);
                if (option && option.label !== inputValue) {
                    inputValue = option.label;
                }
                
                // Show warning if input doesn't match an option
                const matchingOption = normalizedOptions.find(
                    opt => opt.label.toLowerCase() === inputValue.toLowerCase()
                );
                showWarning = inputValue.length > 0 && !matchingOption;
            }
            
            validateInput();
        }, 200);
    }

    $effect(() => {
        validateInput();
    });

    // Initialize inputValue if we have a value
    $effect(() => {
        if (value) {
            const option = normalizedOptions.find(opt => opt.value === value);
            if (option) {
                inputValue = option.label;
                showWarning = false;
            }
        }
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <div class="relative">
        <input
            id={name}
            type="text"
            {autocomplete}
            {placeholder}
            bind:value={inputValue}
            oninput={handleInput}
            onblur={handleBlur}
            onanimationstart={handleAutoFill}
            class="block w-full rounded-md shadow-sm {inputClasses} [-webkit-autofill]:!bg-white"
            title={tooltip ?? undefined}
        />
        
        <!-- Dropdown list -->
        {#if isOpen && filteredOptions.length > 0}
            <ul
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
                {#each filteredOptions as option}
                    <li role="option" aria-selected={option.value === value}>
                        <button
                            type="button"
                            class="block w-full text-left px-3 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                            onclick={() => handleSelection(option)}
                            onkeydown={(e) => e.key === 'Enter' && handleSelection(option)}
                        >
                            {option.label}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
        
        <!-- Hidden input for form submission -->
        <input type="hidden" {name} bind:value={value} />
    </div>
</FormField>