// src/lib/types.ts
import type { AutocompleteType } from '$lib/autocomplete-types.js'
export type FormStyle = 'default' | 'compact' | 'bordered';

export type FormProps = {
    title?: string;
    description?: string;
    style?: FormStyle;
    submit_label?: string;
    on_submit: (event: SubmitEvent) => void;
    is_submitting?: boolean;
    children: () => any;
};

export interface FormFieldProps {
    name: string;
    label: string;
    required?: boolean;
    error?: string;
    children: () => any;
}

type BaseProps = {
    name: string;           // Unique identifier
    label: string;          // Displayed label text
    required?: boolean;     // Is this field required to submit form?
    error_msg?: string;     // Error message to display
    invalid_msg?: string;   // Invalid value message to display
}

// Text Input Types ---------------- //
export type InputProps = BaseProps & {
    placeholder?: string;   // Placeholder text
    value?: string;         // Bindable value
    validator?: RegExp;     // User definable RegEx to validate input
                            // Setting this will override default validation
};

export type TextInputProps = InputProps & {
    autocomplete?: AutocompleteType;    // HTML autocomplete attribute
};

// TODO Simplify height parameters
export type TextAreaProps =  InputProps & {
    autocomplete?: 'off' | 'on';    // Enable or disable autocomplete
    min_height?: number;            // Minimum height of textarea
    height?: number;                // Default height of textarea
    max_height?: number;            // Maximum height of textarea
    resize?: boolean;               // Allow resizing of textarea
};
// ---------------------------- //


// Number Input Types ---------------- //
export type NumberInputProps = BaseProps & {
    prefix?: string;        // Add a prefix symbol (e.g. $, £, €)
    suffix?: string;        // Add a suffix symbol (e.g. %)
    precision?: number;     // Number of decimal places
    steps?: number;         // Incremental steps
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
    bind_start_date: Date | null;
    bind_end_date: Date | null;
    start_value?: Date;
    end_value?: Date;
};

export type DateInputProps = BaseDateProps & {
    value?: Date | null;        // Bindable Date value
};
// ---------------------------- //


// Checkbox Input Types ---------------- //
export type ConsentCheckProps = BaseProps & {
    text: string;           // Displayed text
    checked: boolean;       // Bindable 'checked' boolean value
};

export type CheckboxGroupProps = BaseProps & {
    options: string[];      // Array of user-defined checkbox options
    group: string[];        // Bindable array, gets populated with checked options
    columns?: 2 | 3 | 4;    // Number of columns to display, TODO maybe automate this
};
// ---------------------------- //


// Dropdown Input Types ---------------- //
export type DropdownSelectProps = BaseProps & {
    options: string[];       // Array of user-defined dropdown options
    value: string;           // Bindable value
    selected_value?: string; // Default selected value
                             // If 'selected_value' is provided it overrides placeholder 
    placeholder?: string;    // Placeholder text
};
// ---------------------------- //