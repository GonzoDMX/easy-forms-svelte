<!-- src/lib/components/MultilineTextInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { TextAreaProps, FormStore } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        placeholder = '',
        value = $bindable(''),
        validator,
        autocomplete = 'off',
        size = 'medium',
        resize = false,
        tooltip
    } : TextAreaProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let showWarning = $state(false);
    const isError = formStore.isFieldInError(name);
    let textarea: HTMLTextAreaElement;

    // DEFAULT_HEIGHT is 72 (3L) for 'small', 120 (5L) for 'medium', and 160 (8L) for 'large'
    const DEFAULT_HEIGHT = size === 'small' ? 72 : size === 'medium' ? 120 : 168;
    const MAX_HEIGHT = DEFAULT_HEIGHT * 2;

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
    <textarea
        id={name}
        {name}
        {placeholder}
        {autocomplete}
        {required}
        bind:value={value}
        bind:this={textarea}
        oninput={handleInput}
        style="min-height: {DEFAULT_HEIGHT}px; {resize ? `max-height: ${MAX_HEIGHT}px;` : 'height: ${DEFAULT_HEIGHT}px;'}"
        class="block w-full rounded-md shadow-sm {inputClasses}
               {resize ? 'resize-y' : 'resize-none'}"
        title={tooltip ?? undefined}
    ></textarea>
</FormField>