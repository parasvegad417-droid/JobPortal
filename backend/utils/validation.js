export const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const isValidPhoneNumber = (value) =>
    /^\d{10}$/.test(String(value || "").trim());

export const isValidHttpUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

export const isValidLinkedInUrl = (value) => {
    try {
        const url = new URL(value);
        const hostname = url.hostname.toLowerCase();
        const pathSegments = url.pathname.split("/").filter(Boolean);

        return url.protocol === "https:" &&
            (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) &&
            !url.username &&
            !url.password &&
            ["in", "pub"].includes(pathSegments[0]) &&
            Boolean(pathSegments[1]);
    } catch {
        return false;
    }
};
