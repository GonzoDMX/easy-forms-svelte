<!-- src/lib/components/NewPasswordInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { InputProps, FormStore } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let { 
        name,
        label = "New Password",
        required = false,
        placeholder = '',
        value = $bindable(''),
        // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 non-alphanumeric symbol
        validator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{12,}$/,
        tooltip = 'Enter a password with at least 12 characters (1 uppercase, 1 lowercase, 1 number, and 1 symbol)',
    } : InputProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(`${name}`, required);
    formStore.registerField(`${name}_confirm`, required);

    let confirmValue = $state('');
    let showWarning = $state(false);
    let isValid = $state(false);
    let confirmValid = $state(false);
    
    const isError = formStore.isFieldInError(name);
    const isConfirmError = formStore.isFieldInError(`${name}_confirm`);

    function validatePassword() {
        const isEmpty = !value || value.trim() === '';
        showWarning = !isEmpty && !validator.test(value);
        isValid = !isEmpty && validator.test(value);
        formStore.validateField(name, value, validator);
    }

    function validateConfirmation() {
        const isEmpty = !confirmValue || confirmValue.trim() === '';
        if (isEmpty) {
            confirmValid = false;
            formStore.validateField(`${name}_confirm`, confirmValue, validator);
            return;
        }
        
        // Only show confirmation as valid if both passwords match AND the original password is valid
        confirmValid = isValid && value === confirmValue;
        // Use the same validator for the confirmation field to maintain consistency in form validation
        formStore.validateField(`${name}_confirm`, confirmValue, validator);
    }

    function handlePasswordInput() {
        formStore.clearFieldError(name);
        validatePassword();
        // Revalidate confirmation if it exists
        if (confirmValue) {
            validateConfirmation();
        }
    }

    function handleConfirmInput() {
        formStore.clearFieldError(`${name}_confirm`);
        validateConfirmation();
    }

    $effect(() => {
        validatePassword();
    });

    const passwordClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
        isValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );

    const confirmClasses = $derived(
        $isConfirmError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        value && !confirmValid ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
        confirmValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<div class="space-y-4">
    <FormField name={name} label={label} {required}>
        <input
            id={name}
            {name}
            type="password"
            {placeholder}
            autocomplete="new-password"
            {required}
            bind:value={value}
            oninput={handlePasswordInput}
            class="block w-full rounded-md shadow-sm {passwordClasses}"
            title={tooltip ?? undefined}
        />
    </FormField>

    <FormField 
        name={`${name}_confirm`} 
        label="Confirm Password" 
        {required}
    >
        <input
            id={`${name}_confirm`}
            name={`${name}_confirm`}
            type="password"
            placeholder="Confirm your password"
            autocomplete="new-password"
            {required}
            bind:value={confirmValue}
            oninput={handleConfirmInput}
            class="block w-full rounded-md shadow-sm {confirmClasses}"
            title="Please confirm your password"
        />
    </FormField>
</div>