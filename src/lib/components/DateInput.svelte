<!-- src/lib/components/DateInput.svelte -->
<script lang="ts">
    import type { DateInputProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        value = $bindable(null),
        min_date,
        max_date,
    } : DateInputProps = $props();

    let error = $state('');

    function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    function validateDate(date: Date) {
        if (required && !date) {
            error = error_msg;
            return;
        }

        if (min_date && date < min_date) {
            error = invalid_msg;
            return;
        }

        if (max_date && date > max_date) {
            error = invalid_msg;
            return;
        }

        error = '';
    }

    function handleDateChange(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (!input && !required) {
            value = null;
            error = '';
            return;
        }
        
        value = new Date(input);
        validateDate(value);
    }

    // Initial validation
    $effect(() => {
        if (value) {
            validateDate(value);
        }
    });
</script>

<FormField {name} {label} {required} {error}>
    <input
        type="date"
        {name}
        {required}
        value={value ? formatDate(value) : null}
        min={min_date ? formatDate(min_date) : undefined}
        max={max_date ? formatDate(max_date) : undefined}
        onchange={handleDateChange}
        class="block w-full rounded-md border-gray-300 shadow-sm
               focus:border-indigo-500 focus:ring-indigo-500"
    />
</FormField>