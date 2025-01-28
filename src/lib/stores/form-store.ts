// src/lib/stores/form-store.ts
import { writable, get } from 'svelte/store';
import type { FormStore, FormFieldState, NumRange } from "$lib/types.js";

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

    function valueIsEmpty(value: any) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && !value.trim()) return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
    }

    function validateField(name: string, value: any, validator?: RegExp | NumRange) {
        const states = get(fieldStates);
        const field = states[name];
        
        // Determine if value should be considered empty based on type
        let isEmpty: boolean;
        if (typeof value === 'boolean') {
            // For checkbox/consent fields, only consider it empty if it's required AND false
            isEmpty = field.isRequired ? !value : false;
        } else {
            isEmpty = valueIsEmpty(value);
        }
    
        const hasValidator = !!validator;
        let validatorPassed = null;
    
        if (!isEmpty && hasValidator && validator) {
            if (validator instanceof RegExp) {
                validatorPassed = validator.test(value);
            }
            else if (validator &&
                     validator.min !== undefined &&
                     validator.max !== undefined) {
                validatorPassed = true;
                if (validator.min !== null && value < validator.min) {
                    validatorPassed = false;
                }
                if (validator.max !== null && value > validator.max) {
                    validatorPassed = false;
                }
            }
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
        isFieldInError,
        clearFieldError
    };
}