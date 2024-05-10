import * as yup from 'yup'

export const paymentSchema = yup.object().shape({
    cardHolder: yup
    .string()
    .min(3, "Minimum 3 chars.")
    .max(10, "Maximum 16 chars")
    .required('Required field.'),
    cardNumber: yup
    .string()
    .min(19, "Invalid card number.")
    .max(19, "Invalid card number.")
    .required('Required field.'),
    expDate: yup
    .string()
    .min(5, "Minimum 4 chars.")
    .max(5, "Invalid expiration date.")
    .required('Required field.'),
    cvv: yup
    .string()
    .min(3, "Invalid CVV.")
    .max(3, "Invalid CVV.")
    .required('Required field.'),
});