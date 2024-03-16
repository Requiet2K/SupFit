import Swal from 'sweetalert2'

export const showSuccessLoginModal = async (title: string, text: string) => {
    try {
        const result = await Swal.fire({
            title,
            html: `<div className="d-flex flex-column g-4"><b>${text}</b> <div>You are redirecting to home page.</div></div>`,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
        });
    } catch (error) {
        console.error(error);
    }
};

export const showSuccessRegisteredMethod= async () => {
    try {
        const result = await Swal.fire({
            title: "Successfully Registered!",
            text: "You are redirecting to the login page",
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
        });
    } catch (error) {
        console.error(error);
    }
};

export const showErrorModal = async (title: string, text: string) => {
    try {
        const result = await Swal.fire({
            title,
            text,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
        });
    } catch (error) {
        console.error(error);
    }
};

export const showTimeoutModal = async () => {
    try {
        const result = await Swal.fire({
            title: "Your session has expired.",
            html: `<div class="d-flex flex-column gap-3"><i style="font-size:17px">Please log in again to continue accessing the site.</i><div style="font-size:15px">We prioritize your security, and for that reason, your login session is timed to ensure the safety of your account.</div></div>`,
            text: "Thank you for your understanding. If you have any questions or concerns, feel free to reach out to our support team.",
            icon: "warning",
        });
    } catch (error) {
        console.error(error);
    }
};

export const showUpdateUserModal = async () => {
    try {
        const result = await Swal.fire({
            title: "Successfully updated.",
            text: "Your personal information changes has been saved.",
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
        })
    } catch (error) {
        console.error(error);
    }
}

export const showUpdateUserModalWarning = async () => {
    try {
        const result = await Swal.fire({
            title: "No changes detected.",
            icon: 'warning',
            timer: 2000,
            timerProgressBar: true,
        })
    } catch (error) {
        console.error(error);
    }
}

export const showInvalidPhoneNumber = async () => {
    try {
        const result = await Swal.fire({
            title: "Invalid phone number!",
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
        })
    } catch (error) {
        console.error(error);
    }
}

export const showSuccessModal = async (title: string, text: string) => {
    try {
        const result = await Swal.fire({
            title,
            text,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
        })
    } catch (error) {
        console.error(error);
    }
}

