import { EDocumentType, GetAuthorBy } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (x) => {
    let r = GetAuthorBy(EDocumentType.EAR);
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: {
            earAuthorList: r,
        }
    }
}
