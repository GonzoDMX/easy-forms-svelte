<!-- src/lib/components/DateRangeInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { DateRangeProps, FormStore, NumRange } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        start_date = $bindable(null),
        end_date = $bindable(null),
        min_date,
        max_date,
        tooltip
    } : DateRangeProps = $props();

    const formStore = getContext<FormStore>('formStore');
    // Register both fields with the form store
    formStore.registerField(`${name}_start`, required);
    formStore.registerField(`${name}_end`, required);

    let showWarning = $state(false);
    const isStartError = formStore.isFieldInError(`${name}_start`);
    const isEndError = formStore.isFieldInError(`${name}_end`);

    // Create validators for both dates
    const startValidator: NumRange = {
        min: min_date?.getTime(),
        max: max_date?.getTime()
    };

    function getEndValidator(startDate: Date | null): NumRange {
        return {
            min: startDate?.getTime() ?? min_date?.getTime(),
            max: max_date?.getTime()
        };
    }

    function formatDate(date: Date | null): string {
        return date ? date.toISOString().split('T')[0] : '';
    }

    function validateDates() {
        const startEmpty = !start_date;
        const endEmpty = !end_date;

        if (!startEmpty || !endEmpty) {
            showWarning = Boolean(
                (start_date && min_date && start_date < min_date) ||
                (end_date && max_date && end_date > max_date) ||
                (start_date && end_date && end_date < start_date)
            );
        } else {
            showWarning = false;
        }

        // Validate with form store
        formStore.validateField(
            `${name}_start`, 
            start_date?.getTime(),
            startValidator
        );
        
        formStore.validateField(
            `${name}_end`,
            end_date?.getTime(),
            getEndValidator(start_date)
        );
    }

    function handleStartDateChange(event: Event) {
        formStore.clearFieldError(`${name}_start`);
        
        const input = (event.target as HTMLInputElement).value;
        if (!input && !required) {
            start_date = null;
        } else {
            const newDate = new Date(input);
            if (!isNaN(newDate.getTime())) {
                start_date = newDate;
                // If end date is before new start date, update it
                if (end_date && end_date < start_date) {
                    end_date = new Date(start_date);
                }
            }
        }
        validateDates();
    }

    function handleEndDateChange(event: Event) {
        formStore.clearFieldError(`${name}_end`);
        
        const input = (event.target as HTMLInputElement).value;
        if (!input && !required) {
            end_date = null;
        } else {
            const newDate = new Date(input);
            if (!isNaN(newDate.getTime())) {
                end_date = newDate;
            }
        }
        validateDates();
    }

    // Initial validation
    $effect(() => {
        validateDates();
    });

    const startInputClasses = $derived(
        $isStartError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );

    const endInputClasses = $derived(
        $isEndError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <div class="grid grid-cols-2 gap-4">
        <input
            type="date"
            name={`${name}_start`}
            value={formatDate(start_date)}
            min={min_date ? formatDate(min_date) : undefined}
            max={max_date ? formatDate(max_date) : undefined}
            {required}
            onchange={handleStartDateChange}
            class="block w-full rounded-md shadow-sm {startInputClasses}"
            title={tooltip ?? undefined}
        />
        <input
            type="date"
            name={`${name}_end`}
            value={formatDate(end_date)}
            min={start_date ? formatDate(start_date) : min_date ? formatDate(min_date) : undefined}
            max={max_date ? formatDate(max_date) : undefined}
            {required}
            onchange={handleEndDateChange}
            class="block w-full rounded-md shadow-sm {endInputClasses}"
            title={tooltip ?? undefined}
        />
    </div>
</FormField>