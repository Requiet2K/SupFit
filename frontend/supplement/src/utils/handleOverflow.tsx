export const overflowHidden = (item?: boolean) => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
    const navDesktopElements = document.querySelectorAll('.nav-desktop');
    navDesktopElements.forEach((navDesktopElement) => {
      (navDesktopElement as HTMLElement).style.paddingRight = item ? "17px" : "0px";
    });
}

export const overflowShow = () => {
    document.body.style.overflow = 'visible';
    document.body.style.paddingRight = '0px';
    const navDesktopElements = document.querySelectorAll('.nav-desktop');
    navDesktopElements.forEach((navDesktopElement) => {
        (navDesktopElement as HTMLElement).style.paddingRight = '0px';
    });
}