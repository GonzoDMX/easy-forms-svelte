<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { NumberInputProps, FormStore} from '$lib/types.js';
    import FormField from '$lib/components/FormField.svelte';

    let {
        name,
        label,
        required = false,
        prefix,
        suffix,
        precision = 0,
        step = 1,
        value = $bindable(null),
        max,
        min,
        tooltip
    } : NumberInputProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    let showWarning = $state(false);
    let inputValue = $state(''); // Track the raw input value
    const isError = formStore.isFieldInError(name);

    function formatValue(val: number | null): string {
        if (val === null) return '';
        return precision !== undefined 
            ? val.toFixed(precision)
            : Math.round(val).toString();
    }

    function isValidNumber(num: number | null): boolean {
        if (num === null) return !required;
        if (min !== undefined && num < min) return false;
        if (max !== undefined && num > max) return false;
        if (precision === 0 && !Number.isInteger(num)) return false;
        return true;
    }

    function snapToValidValue(num: number | null): number | null {
        if (num === null) return required ? (min ?? 0) : null;

        // Handle precision
        if (precision !== undefined) {
            const factor = Math.pow(10, precision);
            num = Math.round(num * factor) / factor;
        }

        // Handle min/max
        if (min !== undefined && num < min) return min;
        if (max !== undefined && num > max) return max;
        
        return num;
    }

    function handleInput(event: Event) {
        formStore.clearFieldError(name);
        const input = event.target as HTMLInputElement;
        inputValue = input.value;
        
        const parsedValue = input.value === '' ? null : parseFloat(input.value);
        value = parsedValue;
        
        // Show warning if current value is invalid
        showWarning = parsedValue !== null && !isValidNumber(parsedValue);
    }

    function handleBlur(event: Event) {
        // On blur, snap to valid value
        if (value !== null) {
            const snappedValue = snapToValidValue(value);
            value = snappedValue;
            inputValue = formatValue(snappedValue);
        }
        validateNumber(value);
    }

    function validateNumber(num: number | null) {
        formStore.validateField(name, num, { min, max });
        showWarning = num !== null && !isValidNumber(num);
    }

    onMount(() => {
        // Set initial value if null
        if (value === null) {
            if (min !== undefined) {
                value = min;
            } else if (required) {
                value = 0;
            }
        }

        // If we have a value now, format it and validate
        if (value !== null) {
            inputValue = formatValue(value);
            validateNumber(value);
        }
    });

    // Initialize inputValue when value changes externally
    $effect(() => {
        inputValue = formatValue(value);
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
        showWarning ? 'border-gray-300 focus:border-amber-300 focus:ring-amber-300' :
                     'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );

    function incrementValue() {
        const currentValue = value ?? 0;
        const newValue = currentValue + step;
        
        if (max !== undefined && newValue > max) {
            value = max;
            inputValue = formatValue(max);
        } else {
            value = newValue;
            inputValue = formatValue(newValue);
        }
    }

    function decrementValue() {
        const currentValue = value ?? 0;
        const newValue = currentValue - step;
        
        if (min !== undefined && newValue < min) {
            value = min;
            inputValue = formatValue(min);
        } else {
            value = newValue;
            inputValue = formatValue(newValue);
        }
    }
</script>

<FormField {name} {label} {required}>
    <div class="relative rounded-md shadow-sm">
        {#if prefix}
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">
                    {prefix}
                </span>
            </div>
        {/if}
        <div class="relative flex items-center">
            <input
                type="number"
                id={name}
                {name}
                {required}
                value={inputValue}
                oninput={handleInput}
                onblur={handleBlur}
                step={step}
                class="block w-full rounded-md shadow-sm {inputClasses}
                       {prefix ? 'pl-7' : ''} {suffix ? 'pr-12' : 'pr-8'}
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                title={tooltip ?? undefined}
            />
            <div class="absolute right-0 h-full flex flex-col border-l">
                <button
                    type="button"
                    onclick={incrementValue}
                    class="flex-1 px-2 hover:bg-gray-100 rounded-tr-md"
                    tabindex="-1"
                >
                    <span class="sr-only">Increase</span>
                    <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
                <button
                    type="button"
                    onclick={decrementValue}
                    class="flex-1 px-2 hover:bg-gray-100 rounded-br-md"
                    tabindex="-1"
                >
                    <span class="sr-only">Decrease</span>
                    <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        {#if suffix}
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">
                    {suffix}
                </span>
            </div>
        {/if}
    </div>
</FormField>