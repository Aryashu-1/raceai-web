export interface HubSpotFormData {
    email: string;
    firstname?: string;
    lastname?: string;
    mobilephone?: string;
    company?: string;
    jobtitle?: string;
    lifecyclestage?: string;
    [key: string]: string | undefined;
}

export const submitToHubSpot = async (data: HubSpotFormData) => {
    const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
    const formGuid = process.env.NEXT_PUBLIC_HUBSPOT_FORM_GUID;

    if (!portalId || !formGuid) {
        console.warn("HubSpot Portal ID or Form GUID not set. Skipping HubSpot submission.");
        return { success: false, message: "Missing configuration" };
    }

    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: Object.entries(data).map(([name, value]) => ({
                    name,
                    value,
                })),
                context: {
                    pageUri: window.location.href,
                    pageName: document.title,
                },
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("HubSpot submission failed", err);
            return { success: false, error: err };
        }

        const result = await response.json();
        console.log("✅ HubSpot submission successful", result);
        return { success: true, result };

    } catch (error) {
        console.error("HubSpot error:", error);
        return { success: false, error };
    }
};
