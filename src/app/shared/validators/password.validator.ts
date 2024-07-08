import { AbstractControl } from "@angular/forms";

export function confirmPasswordValidator(form: AbstractControl): { [key: string]: boolean; } | null {
    const pass = form.get("password");
    const confirmPass = form.get("confirmPassword");

    if (confirmPass!.errors && !confirmPass!.errors["mismatch"]) {
        // Already has other errors, don't overwrite them
        return null;
    }

    if (pass!.dirty && confirmPass!.dirty && pass!.value !== confirmPass!.value) {
        confirmPass!.setErrors({ mismatch: true });
        return { mismatch: true };
    } else {
        confirmPass!.setErrors(null); // Clear any existing 'mismatch' error
        return null;
    }

}