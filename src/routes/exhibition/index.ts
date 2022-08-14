import { EDocumentType, GetRandomDocument } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (x) => {
    let eye = GetRandomDocument(EDocumentType.EYE);
    let ear = GetRandomDocument(EDocumentType.EAR);
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
