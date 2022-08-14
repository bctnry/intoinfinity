import { GetAuthorBy } from "$lib/database";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (x) => {
    let r = await GetAuthorBy(x.url, x.url.searchParams.get('document_type')||'Eye' as any);
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: r
    }
}
