// src/lib/stores/form-store.ts
import { writable, get } from 'svelte/store';
import type { FormStore, FormFieldState } from "$lib/types.js";

export function createFormStore(): FormStore {
    const fieldStates = writable<Record<string, FormFieldState>>({});
    const errorFields = writable<Set<string>>(new Set());

    function registerField(name: string, required: boolean) {
        fieldStates.update(states => ({
            ...states,
            [name]: {
                name,
                isRequired: required,
                isEmpty: true,
                hasValidator: false,
                validatorPassed: null
            }
        }));
    }

    function validateField(name: string, value: any, validator?: RegExp) {
        const isEmpty = !value || (typeof value === 'string' && !value.trim());
        const hasValidator = !!validator;
        let validatorPassed = null;

        if (!isEmpty && hasValidator && validator) {
            validatorPassed = validator.test(value);
        }

        fieldStates.update(states => ({
            ...states,
            [name]: {
                ...states[name],
                isEmpty,
                hasValidator,
                validatorPassed
            }
        }));
    }

    function handleSubmit() {
        const states = get(fieldStates);
        const errors: Array<{ name: string; type: 'empty' | 'invalid' }> = [];
        const newErrorFields = new Set<string>();  // Track error fields

        Object.values(states).forEach((field) => {
            if (field.isRequired && field.isEmpty) {
                errors.push({ name: field.name, type: 'empty' });
                newErrorFields.add(field.name);  // Add to error set
            } else if (field.hasValidator && !field.isEmpty && !field.validatorPassed) {
                errors.push({ name: field.name, type: 'invalid' });
                newErrorFields.add(field.name);  // Add to error set
            }
        });

        errorFields.set(newErrorFields);  // Update error fields

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    function isFieldInError(name: string) {
        const errorStore = {
            subscribe: (fn: (value: boolean) => void) => {
                return errorFields.subscribe(fields => fn(fields.has(name)))
            }
        };
        return errorStore;
    }

    // Add this function to clear error state
    function clearFieldError(name: string) {
        errorFields.update(fields => {
            fields.delete(name);
            return fields;
        });
    }

    return {
        registerField,
        validateField,
        handleSubmit,
        isFieldInError,    // Add to return
        clearFieldError    // Add to return
    };
}