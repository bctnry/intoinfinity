import { EDocumentType, GetRandomDocument, GetRandomDocumentByAuthor } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (x) => {
    let type: EDocumentType =
        (x.url.searchParams.get('type')||'Eye').toLocaleLowerCase() === 'eye'?
            EDocumentType.EYE
            : EDocumentType.EAR
    ;
    let subj = GetRandomDocumentByAuthor(type, x.params.name);
    let subj2 = GetRandomDocument(type === EDocumentType.EAR? EDocumentType.EYE : EDocumentType.EAR);
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
