<!-- src/lib/components/MultilineTextInput.svelte -->
<script lang="ts">
    import type { TextAreaProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        placeholder = '',
        value = $bindable(''),
        validator,
        autocomplete = 'off',
        resize = false
    } : TextAreaProps = $props();

    let error = $state('');
    let textarea: HTMLTextAreaElement;

    const DEFAULT_HEIGHT = 72; // 3 lines
    const MAX_HEIGHT = DEFAULT_HEIGHT * 2; // 6 lines

    function validate(value: string) {
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
    <textarea
        id={name}
        {name}
        {placeholder}
        {autocomplete}
        {required}
        bind:value={value}
        bind:this={textarea}
        oninput={() => { validate(value); }}
        style="min-height: {DEFAULT_HEIGHT}px; {resize ? `max-height: ${MAX_HEIGHT}px;` : 'height: ${DEFAULT_HEIGHT}px;'}"
        class="block w-full rounded-md border-gray-300 shadow-sm
               focus:border-indigo-500 focus:ring-indigo-500
               {resize ? 'resize-y' : 'resize-none'}"
    ></textarea>
</FormField>