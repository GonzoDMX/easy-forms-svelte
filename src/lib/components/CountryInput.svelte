<!-- src/lib/components/CountryInput.svelte -->
<script lang="ts">
    import type { InputProps } from '$lib/types.js';
    import type { CountryData } from '$lib/utils/country-types.js';
    import FormField from '$lib/components/FormField.svelte';
    import { countryUtils } from '$lib/utils/country.js';

    let { 
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        placeholder = '',
        value = $bindable(''),
        validator
    } : InputProps = $props();

    let userLanguage = countryUtils.getLocale();
    let countryOptions = $state<CountryData[]>([]);
    let allCountryOptions = countryUtils.getCountryData(userLanguage);
    let error = $state('');
    let warn = $state(false);
    
    function validate(val: string): void {
        if (required && !value.trim()) {
            error = error_msg;
            return;
        }
        if (validator && !validator.test(value)) {
            warn = true;
            return;
        }
        warn = false;
        error = '';
    }

    $effect(() => {
        if (value) validate(value);
    });

    function handleCountryInput(event: Event) {
        const input = (event.target as HTMLInputElement).value.trim();
        
        countryOptions = input.length >= 2 
            ? allCountryOptions.filter(({ name }) => 
                name.toLowerCase().startsWith(input.toLowerCase()))
            : [];

        value = countryUtils.standardizeCountry(input, userLanguage) ?? '';
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