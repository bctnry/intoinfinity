import { EDocumentType, GetRandomDocument } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (x) => {
    let type: EDocumentType = (x.url.searchParams.get('document_type')||'Eye') as any;
    let doc = GetRandomDocument(type);
    return {
        status: 200,
        accept: 'application/json',
        body: doc
    };
}
