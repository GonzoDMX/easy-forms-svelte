<!-- src/lib/components/NumberInput.svelte -->
<script lang="ts">
    import type { NumberInputProps } from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        prefix,
        suffix,
        precision,
        steps = 1,
        value = $bindable(null),
        max,
        min
    } : NumberInputProps = $props();

    let error = $state('');

    function formatValue(val: number | null): string {
        if (val === null) return '';
        return precision !== undefined 
            ? val.toFixed(precision)
            : Math.round(val).toString();
    }

    function validateNumber(num: number | null) {
        if (required && (num === null || num === undefined)) {
            error = error_msg;
            return;
        }
        if (num !== null) {
            if (min !== undefined && num < min) {
                error = invalid_msg;
                return;
            }
            if (max !== undefined && num > max) {
                error = invalid_msg;
                return;
            }
        }
        error = '';
    }

    function handleInput(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        
        if (input === '') {
            value = required ? 0 : null;
        } else {
            const num = Number(input);
            if (isNaN(num)) {
                error = invalid_msg;
                return;
            }
            value = num;
        }
        validateNumber(value);
    }

    // Initial validation
    $effect(() => {
        validateNumber(value);
    });
</script>

<FormField {name} {label} {required} {error}>
    <div class="relative rounded-md shadow-sm">
        {#if prefix}
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">
                    {prefix}
                </span>
            </div>
        {/if}
        <input
            type="number"
            {name}
            {required}
            value={formatValue(value)}
            oninput={handleInput}
            step={steps}
            {max}
            {min}
            class="block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring-indigo-500
                   {prefix ? 'pl-7' : ''} {suffix ? 'pr-7' : ''}"
        />
        {#if suffix}
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">
                    {suffix}
                </span>
            </div>
        {/if}
    </div>
</FormField>