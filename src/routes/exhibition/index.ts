import { EDocumentType, GetRandomDocument } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (x) => {
    let eye = await GetRandomDocument(x.url, EDocumentType.EYE);
    let ear = await GetRandomDocument(x.url, EDocumentType.EAR);
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: {
            eye: eye,
            ear: ear,
        }
    };
}
