import * as yup from 'yup'

export const forgetEmailSchema = yup.object().shape({
    email: yup
    .string()
    .email('Invalid email.')
    .required('Required field.'),
});