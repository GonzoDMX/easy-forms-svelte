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
        min_height = 1,
        height = 3,
        max_height = 4,
        resize = false,
    } : TextAreaProps = $props();

    let error = $state('');
    let textarea: HTMLTextAreaElement;

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

    function adjustHeight() {
        if (!resize) return;
        
        textarea.style.height = 'auto';
        const newHeight = Math.min(
            Math.max(
                textarea.scrollHeight / 24,
                min_height
            ),
            max_height
        );
        textarea.style.height = `${newHeight * 24}px`;
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
        oninput={() => {
            validate(value);
            adjustHeight();
        }}
        style="min-height: {min_height * 24}px; height: {height * 24}px; max-height: {max_height * 24}px;"
        class="block w-full rounded-md border-gray-300 shadow-sm
               focus:border-indigo-500 focus:ring-indigo-500
               {resize ? 'resize-y' : 'resize-none'}"
    ></textarea>
</FormField>