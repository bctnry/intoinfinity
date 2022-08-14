import { GetAuthorBy } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = (x) => {
    let r = GetAuthorBy(x.url.searchParams.get('document_type')||'Eye' as any);
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: r
    }
}
