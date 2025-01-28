<!-- src/lib/components/DateInput.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { DateInputProps, FormStore, NumRange } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        value = $bindable(null),
        min_date,
        max_date,
        tooltip
    } : DateInputProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let showWarning = $state(false);
    const isError = formStore.isFieldInError(name);

    // Convert dates to timestamps for validation
    const dateValidator: NumRange = {
        min: min_date?.getTime(),
        max: max_date?.getTime()
    };

    function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    function validateInput(date: Date | null) {
        const isEmpty = !date;
        
        if (!isEmpty) {
            const timestamp = date.getTime();
            showWarning = (min_date ? timestamp < min_date.getTime() : false) || 
                         (max_date ? timestamp > max_date.getTime() : false);
        } else {
            showWarning = false;
        }

        // Pass the timestamp for validation if we have a date
        formStore.validateField(name, date?.getTime(), dateValidator);
    }

    function handleDateChange(event: Event) {
        formStore.clearFieldError(name);
        
        const input = (event.target as HTMLInputElement).value;
        if (!input) {
            value = null;
            validateInput(null);
            return;
        }
        
        const newDate = new Date(input);
        // Check if date is valid before setting
        if (!isNaN(newDate.getTime())) {
            value = newDate;
            validateInput(newDate);
        }
    }

    // Initial validation
    $effect(() => {
        validateInput(value);
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<FormField {name} {label} {required}>
    <input
        id={name}
        type="date"
        {name}
        {required}
        value={value ? formatDate(value) : ''}
        min={min_date ? formatDate(min_date) : undefined}
        max={max_date ? formatDate(max_date) : undefined}
        onchange={handleDateChange}
        class="block w-full rounded-md shadow-sm {inputClasses}"
        title={tooltip ?? undefined}
    />
</FormField>