<!-- src/lib/components/DateRangeInput.svelte -->
<script lang="ts">
    import type { DateRangeProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        bind_start_date,
        bind_end_date,
        start_value,
        end_value,
        min_date,
        max_date,
    } : DateRangeProps = $props();

    let error = $state('');

    // Set initial values if provided
    $effect(() => {
        if (start_value !== undefined && bind_start_date === null) {
            bind_start_date = start_value;
        }
        if (end_value !== undefined && bind_end_date === null) {
            bind_end_date = end_value;
        }
    });

    function formatDate(date: Date | null): string {
        return date ? date.toISOString().split('T')[0] : '';
    }

    function validateDates() {
        if (required && (!bind_start_date || !bind_end_date)) {
            error = error_msg;
            return;
        }

        if (bind_start_date && min_date && bind_start_date < min_date) {
            error = invalid_msg;
            return;
        }

        if (bind_end_date && max_date && bind_end_date > max_date) {
            error = invalid_msg;
            return;
        }

        if (bind_start_date && bind_end_date && bind_end_date < bind_start_date) {
            error = invalid_msg;
            return;
        }

        error = '';
    }

    function handleStartDateChange(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (!input && !required) {
            bind_start_date = null;
        } else {
            bind_start_date = new Date(input);
            // If end date is before new start date, update it
            if (bind_end_date && bind_end_date < bind_start_date) {
                bind_end_date = bind_start_date;
            }
        }
        validateDates();
    }

    function handleEndDateChange(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (!input && !required) {
            bind_end_date = null;
        } else {
            bind_end_date = new Date(input);
        }
        validateDates();
    }

    // Initial validation
    $effect(() => {
        if (bind_start_date || bind_end_date) {
            validateDates();
        }
    });
</script>

<FormField {name} {label} {required} {error}>
    <div class="grid grid-cols-2 gap-4">
        <input
            type="date"
            name={`${name}_start`}
            value={formatDate(bind_start_date)}
            min={min_date ? formatDate(min_date) : undefined}
            max={max_date ? formatDate(max_date) : undefined}
            {required}
            onchange={handleStartDateChange}
            class="block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring-indigo-500"
        />
        <input
            type="date"
            name={`${name}_end`}
            value={formatDate(bind_end_date)}
            min={bind_start_date ? formatDate(bind_start_date) : undefined}
            max={max_date ? formatDate(max_date) : undefined}
            {required}
            onchange={handleEndDateChange}
            class="block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring-indigo-500"
        />
    </div>
</FormField>