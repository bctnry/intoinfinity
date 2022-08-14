import type { RequestHandler } from "@sveltejs/kit";
import { ArtistIndex } from "$lib/database";

export const GET: RequestHandler = async (x) => {
    let index = await ArtistIndex(x.url);
    let eyes: any[] = [];
    let ears: any[] = [];
    for (const k in index) {
        if (Object.prototype.hasOwnProperty.call(index, k)) {
            const v = index[k];
            if (v.Ear && v.Ear.length > 0) { ears.push([k, v]); }
            if (v.Eye && v.Eye.length > 0) { eyes.push([k, v]); }
        }
    }
    return {
        status: 200,
        headers: {
            accept: 'application/json',
        },
        body: { status: 200, data: {
            ears: ears,
            eyes: eyes,
        } }
    };
}
