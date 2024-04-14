import * as yup from 'yup'
const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const addressModalSchema = yup.object().shape({
    addressTitle: yup
    .string()
    .min(3, "Minimum 3 chars.")
    .max(10, "Maximum 10 chars")
    .required('Required field.'),
    addressFirstName: yup
    .string()
    .min(3, "Minimum 3 chars.")
    .required('Required field.'),
    addressLastName: yup
    .string()
    .min(3, "Minimum 3 chars.")
    .required('Required field.'),
    addressCountry: yup
    .string()
    .min(3, "Minimum 3 chars.")
    .required('Required field.'),
    addressCity: yup
    .string()
    .min(3, "Select a city.")
    .required('Required field.'),
    addressDistrict: yup
    .string()
    .min(3, "Select a district.")
    .required('Required field.'),
    addressAddress: yup
    .string()
    .min(10, "Enter your address. Min 10 chars")
    .required('Required field.'),
});