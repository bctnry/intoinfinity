import { EDocumentType, GetRandomDocument, GetRandomDocumentByAuthor } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (x) => {
    let type: EDocumentType =
        (x.url.searchParams.get('type')||'Eye').toLocaleLowerCase() === 'eye'?
            EDocumentType.EYE
            : EDocumentType.EAR
    ;
    let subj = await GetRandomDocumentByAuthor(x.url, type, x.params.name);
    let subj2 = await GetRandomDocument(x.url, type === EDocumentType.EAR? EDocumentType.EYE : EDocumentType.EAR);
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: {
            eye: type === EDocumentType.EAR? subj2 : subj,
            ear: type === EDocumentType.EAR? subj : subj2,
            type: type,
        }
    }
};
