import * as yup from 'yup'
const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const forgetNewPassYup = yup.object().shape({
    newPassword: yup
    .string()
    .min(5, 'Minimum 5  chars')
    .matches(passwordRule, {
        message: 'Password must contain at least 1 lowercase & uppercase char and 1 digit.'
    })
    .required('Required field.'),
    confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords not match')
    .required('Required field.')
});