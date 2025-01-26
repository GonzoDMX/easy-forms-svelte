<!-- src/lib/components/UrlInput.svelte -->
<script lang="ts">
    import type { InputProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let { 
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        placeholder = '',
        value = $bindable(''),
        validator = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    } : InputProps = $props();

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
</script>

<FormField {name} {label} {required} {error}>
    <input
        id={name}
        {name}
        type='url'
        {placeholder}
        autocomplete='url'
        {required}
        bind:value={value}
        oninput={() => validate(value)}
        class="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500"
    />
</FormField>