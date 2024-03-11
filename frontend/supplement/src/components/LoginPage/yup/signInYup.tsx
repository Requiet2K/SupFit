import * as yup from 'yup'
const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const signInSchema = yup.object().shape({
    signEmail: yup
    .string()
    .email('Invalid email.')
    .required('Required field.'),
    signPassword: yup
    .string()
    .min(5, 'Minimum 5  chars')
    .matches(passwordRule, {
        message: 'Password must contain at least 1 lowercase & uppercase char and 1 digit.'
    })
    .required('Required field.'),
});