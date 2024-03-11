import * as yup from 'yup'
const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const signUpSchema = yup.object().shape({
    firstName: yup
    .string()
    .min(3,'Minimum 3 chars')
    .required('Required field.'),
    lastName: yup
    .string()
    .min(2,'Minimum 2 chars')
    .required('Required field.'),
    email: yup
    .string()
    .email('Invalid email.')
    .required('Required field.'),
    password: yup
    .string()
    .min(5, 'Minimum 5  chars')
    .matches(passwordRule, {
        message: 'Password must contain at least 1 lowercase & uppercase char and 1 digit.'
    })
    .required('Required field.'),
    confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords not match')
    .required('Required field.'), 
});