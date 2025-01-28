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

    // RegEx patter for two-letter country codes
    const validator = /^[A-Za-z]{2}$/;

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let userLanguage = countryUtils.getLocale();
    let countryOptions = $state<CountryData[]>([]);
    let allCountryOptions = countryUtils.getCountryData(userLanguage);
    let showWarning = $state(false);
    const isError = formStore.isFieldInError(name);

    function handleCountryInput(event: Event) {
        const input = (event.target as HTMLInputElement).value.trim();
        
        countryOptions = input.length >= 2 
            ? allCountryOptions.filter(({ name }) => 
                name.toLowerCase().startsWith(input.toLowerCase()))
            : [];

        value = countryUtils.standardizeCountry(input, userLanguage) ?? '';

        formStore.clearFieldError(name);
        validateInput();
    }

    function validateInput() {
        const isEmpty = !value || value.trim() === '';
        showWarning = !isEmpty && !validator.test(value);
        formStore.validateField(name, value, validator);
    }

    $effect(() => {
        validateInput();
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-gray-300 focus:border-amber-300 focus:ring-amber-300' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <input
        list="countries"
        id={name}
        {name}
        type="text"
        {placeholder}
        autocomplete="off"
        {required}
        oninput={handleCountryInput}
        class="block w-full rounded-md shadow-sm {inputClasses}"
        title={tooltip ?? undefined}
    />
    <datalist id="countries">
        {#each countryOptions as { name }}
            <option value={name}></option>
        {/each}
    </datalist>
    <input type="hidden" bind:value={value} />
</FormField>