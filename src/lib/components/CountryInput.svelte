<!-- src/lib/components/TextInput.svelte -->
<script lang="ts">
    import type { InputProps} from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';
    import { getLocale, getCountryData, standardizeCountry } from '$lib/utils/country.js';

    let { 
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        placeholder = '',
        value = $bindable(''),
        validator = /^[a-zA-Z\s]+$/
    } : InputProps = $props();

    let userLanguage = getLocale();
    let countryOptions = $state<{ name: string }[]>([]); // Filtered country options for autocomplete
    let allCountryOptions = getCountryData(userLanguage); 
    let error = $state('');
    
    function validate(value: string): void {
        if (required && !value.trim()) {
            error = error_msg;
            return;
        }
        if (validator && !validator.test(value)) {
            error = invalid_msg;
            return;
        }
        error = '';
    }

    // Initial validation
    $effect(() => {
        if (value) {
            validate(value);
        }
    });

    function handleCountryInput(event: Event) {
        const input = (event.target as HTMLInputElement).value.trim();

        // Show autocomplete only after two characters
        if (input.length >= 2) {
            countryOptions = allCountryOptions.filter(({ name }: { name: string }) =>
            name.toLowerCase().startsWith(input.toLowerCase())
            );
        } else {
            countryOptions = []; // Clear options if input is too short
        }

        // Validate and standardize input
        const standardizedCode = standardizeCountry(input, userLanguage);
        if (!standardizedCode) {
            value = ''; // Clear the code if invalid
        } else {
            value = standardizedCode; // Store the ISO Alpha-2 code
        }
    }
</script>

<FormField {name} {label} {required} {error}>
    <input
        list="countries"
        id={name}
        {name}
        {placeholder}
        autocomplete="off"
        {required}
        oninput={handleCountryInput}
        class="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500"
    />
    <datalist id="countries">
        {#each countryOptions as { name }}
            <option value={name}></option>
        {/each}
    </datalist>
    <input type="hidden" bind:value={value} />
</FormField>