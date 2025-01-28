// src/lib/types.ts
import type { AutocompleteType } from '$lib/autocomplete-types.js'
export type FormStyle = 'default' | 'compact' | 'bordered';
import type { Readable } from 'svelte/store';

export interface FormFieldState {
    name: string;
    isRequired: boolean;
    isEmpty: boolean;
    hasValidator: boolean;
    validatorPassed: boolean | null;
}

export type NumRange = { min?: number; max?: number };

export interface FormStore {
    registerField: (name: string, required: boolean) => void;
    validateField: (name: string, value: any, validator?: RegExp | NumRange) => void;
    handleSubmit: () => { 
        isValid: boolean;
        errors: Array<{ 
            name: string; 
            type: 'empty' | 'invalid' 
        }> 
    };
    isFieldInError: (name: string) => Readable<boolean>;
    clearFieldError: (name: string) => void;
}

export interface FormState {
    fields: Record<string, FormFieldState>;
    isSubmitting: boolean;
    isValid: boolean;
    hasBeenSubmitted: boolean;
}

export type FormProps = {
    title?: string;
    description?: string;
    style?: FormStyle;
    submit_label?: string;
    error_message?: string; 
    on_submit: (event: SubmitEvent) => void;
    is_submitting?: boolean;
    children: () => any;
};

export interface FormFieldProps {
    name: string;
    label: string;
    required?: boolean;
    error?: string | null;
    warning?: string | null;
    children: () => any;
}

type BaseProps = {
    name: string;           // Unique identifier
    label: string;          // Displayed label text
    required?: boolean;     // Is this field required to submit form?
    tooltip?: string;       // Tooltip text
}

export type PasswordProps = {
    name: string;           // Unique identifier
    label: string;          // Displayed label text
    placeholder?: string;   // Placeholder text
    value?: string;         // Bindable value
    tooltip?: string;       // Tooltip text
}

export type CountryProps = BaseProps & {
    placeholder?: string;   // Placeholder text
    value?: string;         // Bindable value
}

// Text Input Types ---------------- //
export type InputProps = BaseProps & {
    placeholder?: string;   // Placeholder text
    value?: string;         // Bindable value
    validator?: RegExp;     // User definable RegEx to validate input
                            // Setting this will override default validation
};

export type BaseInputProps = InputProps & {
    type: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';
    autocomplete?: AutocompleteType;    // HTML autocomplete attribute
};

export type TextInputProps = InputProps & {
    autocomplete?: AutocompleteType;    // HTML autocomplete attribute
};

// TODO Simplify height parameters
export type TextAreaProps =  InputProps & {
    autocomplete?: 'off' | 'on';    // Enable or disable autocomplete
    size?: 'small' | 'medium' | 'large'; // Textarea height
    resize?: boolean;        // Textarea height
};
// ---------------------------- //


// Number Input Types ---------------- //
export type NumberInputProps = BaseProps & {
    prefix?: string;        // Add a prefix symbol (e.g. $, £, €)
    suffix?: string;        // Add a suffix symbol (e.g. %)
    precision?: number;     // Number of decimal places
    step?: number;          // Incremental step
    value?: number | null;  // Bindable value
    max?: number;           // Maximum value permitted
    min?: number;           // Minimum value permitted
};
// ---------------------------- //


// Date Input Types ---------------- //
export type BaseDateProps = BaseProps & {
    min_date?: Date;        // Minimum (Earliest) date permitted
    max_date?: Date;        // Maximum (Latest) date permitted
};

export type DateRangeProps = BaseDateProps & {
    start_date: Date | null;
    end_date: Date | null;
};

export type DateInputProps = BaseDateProps & {
    value?: Date | null;        // Bindable Date value
};
// ---------------------------- //


// Checkbox Input Types ---------------- //
export type ConsentCheckProps = {
    name: string;           // Unique identifier
    required?: boolean;     // Is this field required to submit form?
    text: string;           // Displayed text
    checked: boolean;       // Bindable 'checked' boolean value
    tooltip?: string;       // Tooltip text
};

export type OptionPair = {
    value: string;
    label: string;
};

export type SelectOptions = readonly (string | OptionPair)[] | (string | OptionPair)[];

export type CheckboxGroupProps = {
    name: string;               // Unique identifier
    label: string;              // Displayed label text
    required?: boolean;         // Is this field required to submit form?
    error_msg?: string;         // Error message to display
    options: SelectOptions;     // Array of options (simple strings or value/label pairs)
    group: string[];            // Bindable array, gets populated with checked options
    columns?: 2 | 3 | 4;        // Number of columns to display, TODO maybe automate this
};
// ---------------------------- //

// Dropdown Input Types ---------------- //
export type DropdownSelectProps = {
    name: string;                   // Unique identifier
    label: string;                  // Displayed label text
    required?: boolean;             // Is this field required to submit form?
    options: SelectOptions;         // Array of options (simple strings or value/label pairs)
    value: string;                  // Bindable value
    selected_value?: string | null; // Default selected value
                                    // If 'selected_value' is provided it overrides placeholder 
    placeholder?: string | null;    // Placeholder text
    tooltip?: string;               // Tooltip text
};
// ---------------------------- //
