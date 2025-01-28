<!-- src/lib/components/CountryInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { CountryProps, FormStore } from '$lib/types.js';
    import type { CountryData } from '$lib/utils/country-types.js';
    import FormField from '$lib/components/FormField.svelte';
    import { countryUtils } from '$lib/utils/country.js';

    let { 
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        tooltip = 'Please enter a country name'
    } : CountryProps = $props();

    // RegEx pattern for two-letter country codes (for form validation)
    const validator = /^[A-Za-z]{2}$/;

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let userLanguage = countryUtils.getLocale();
    let countryOptions = $state<CountryData[]>([]);
    let allCountryOptions = countryUtils.getCountryData(userLanguage);
    let showWarning = $state(false);
    let isOpen = $state(false);
    let inputValue = $state('');
    const isError = formStore.isFieldInError(name);

    function processInput(input: string) {
        // Show dropdown if we have input
        isOpen = input.length >= 1;
        
        // Filter country options
        countryOptions = input.length >= 1 
            ? allCountryOptions.filter(({ name: countryName }) => 
                countryName.toLowerCase().includes(input.toLowerCase()))
            : [];

        // Check if the current input exactly matches a country name
        const matchingCountry = allCountryOptions.find(
            country => country.name.toLowerCase() === input.toLowerCase()
        );

        if (matchingCountry) {
            // If we found an exact match, treat it like a selection
            handleSelection(matchingCountry);
        } else {
            // Show warning if we have input but it doesn't match a country name
            showWarning = input.length > 0 && !matchingCountry;

            // Only clear validation state if input is empty
            if (!input) {
                value = '';
                formStore.clearFieldError(name);
                validateInput();
            }
        }
    }

    function handleInput(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        inputValue = input;
        processInput(input);
    }

    function handleAutoFill() {
        // Check if the input has been autofilled
        requestAnimationFrame(() => {
            const input = (document.getElementById(name) as HTMLInputElement)?.value;
            if (input && input !== inputValue) {
                inputValue = input;
                processInput(input);
            }
        });
    }

    function handleSelection(country: CountryData) {
        inputValue = country.name;
        value = country.code;
        isOpen = false;
        showWarning = false;
        formStore.clearFieldError(name);
        validateInput();
    }

    function validateInput() {
        const isEmpty = !value || value.trim() === '';
        // We let the form store handle the actual validation
        formStore.validateField(name, value, validator);
    }

    function handleBlur() {
        // Give time for click events to register before closing
        setTimeout(() => {
            isOpen = false;
            
            // If we have a valid country code, ensure the display shows the correct name
            if (value) {
                const country = allCountryOptions.find(c => c.code === value);
                if (country && country.name !== inputValue) {
                    inputValue = country.name;
                }
            }

            // Check if current input matches a country name
            const matchingCountry = allCountryOptions.find(
                country => country.name.toLowerCase() === inputValue.toLowerCase()
            );
            
            // Show warning if we have input but it doesn't match a country name
            showWarning = inputValue.length > 0 && !matchingCountry;
            
            validateInput();
        }, 200);
    }

    $effect(() => {
        validateInput();
    });

    // Initialize inputValue if we have a value
    $effect(() => {
        if (value) {
            const country = allCountryOptions.find(c => c.code === value);
            if (country) {
                inputValue = country.name;
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
            autocomplete="off"
            placeholder={placeholder}
            bind:value={inputValue}
            oninput={handleInput}
            onblur={handleBlur}
            onanimationstart={handleAutoFill}
            class="block w-full rounded-md shadow-sm {inputClasses} [-webkit-autofill]:!bg-white"
            title={tooltip ?? undefined}
        />
        
        <!-- Dropdown list -->
        {#if isOpen && countryOptions.length > 0}
            <ul
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
                {#each countryOptions as country}
                    <li role="option" aria-selected={country.name === value}>
                        <button
                            type="button"
                            class="block w-full text-left px-3 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                            onclick={() => handleSelection(country)}
                            onkeydown={(e) => e.key === 'Enter' && handleSelection(country)}
                        >
                            {country.name}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
        
        <!-- Hidden input for form submission -->
        <input type="hidden" {name} bind:value={value} />
    </div>
</FormField>