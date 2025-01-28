<!-- src/lib/components/EmailInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { BaseInputProps, FormStore } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let { 
        name,
        label,
        type='text',
        required = false,
        placeholder = '',
        value = $bindable(''),
        autocomplete='off',
        validator,
        tooltip
    } : BaseInputProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let showWarning = $state(false);
    const isError = formStore.isFieldInError(name);

    function validateInput() {
        const isEmpty = !value || value.trim() === '';
        if (validator) {
            showWarning = !isEmpty && !validator.test(value);
        }
        formStore.validateField(name, value, validator);
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
        showWarning ? 'border-gray-300 focus:border-amber-300 focus:ring-amber-300' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <input
        id={name}
        {name}
        type={type}
        {placeholder}
        autocomplete={autocomplete}
        {required}
        bind:value={value}
        oninput={handleInput}
        class="block w-full rounded-md shadow-sm {inputClasses}"
        title={tooltip ?? undefined}
    />
</FormField>