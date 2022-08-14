import * as fs from 'fs';
import * as path from 'path';

export type IArtist = {
    Name: string,
    Location: string,
    Url: string,
    Eye: string[],
    Ear: string[]
};

let _EarDocumentList: string[]|undefined = undefined;
let _EyeDocumentList: string[]|undefined = undefined;
let _DocumentIndex: {[fileName: string]: string}|undefined = undefined;
let _ArtistIndex: {[name: string]: IArtist}|undefined = undefined;


const _EyeRoot = '/documents/Eye/';
const _EyeSmallRoot = `${_EyeRoot}small/`;
const _EarRoot = '/documents/Ear/';

async function _InitDB(baseURL: URL) {
    console.log(`initdb`);
    _ArtistIndex = await (await fetch(`${baseURL.origin}/documents/index`)).json();
    _DocumentIndex = {};
    _EarDocumentList = [];
    _EyeDocumentList = [];
    for (const k in _ArtistIndex) {
        if (Object.prototype.hasOwnProperty.call(_ArtistIndex, k)) {
            const v = _ArtistIndex[k];
            v.Eye.forEach((n: any) => { _DocumentIndex![n] = k; _EyeDocumentList?.push(n); });
            v.Ear.forEach((n: any) => { _DocumentIndex![n] = k; _EarDocumentList?.push(n); });
            _ArtistIndex[k].Name = k;
        }
    }
}

export async function ArtistIndex(baseURL: URL) {
    if (!_ArtistIndex) { await _InitDB(baseURL); }
    return _ArtistIndex;
}

export enum EDocumentType {
    EAR = 'Ear',
    EYE = 'Eye',
}

export type IDocument = {
    fileName: string,
    author: string,
    location: string,
    gallerySizePath?: string,
    mediumSizePath?: string,
    smallSizePath?: string,
}

export async function GetAuthorBy(baseURL: URL, by: EDocumentType) {
    if (!_ArtistIndex) { await _InitDB(baseURL); }
    let res: IArtist[] = [];
    for (const k in _ArtistIndex) {
        if (Object.prototype.hasOwnProperty.call(_ArtistIndex, k)) {
            const v = _ArtistIndex[k];
            if (v[by] && v[by].length > 0) {
                res.push(v);
            }
        }
    }
    return res;
}

export async function GetRandomDocumentByAuthor(baseURL: URL, by: EDocumentType, author: string) {
    if (!_ArtistIndex) { await _InitDB(baseURL); }
    let index = await (await fetch(`${baseURL.origin}/documents/index.${author.replaceAll(':', '_').replaceAll('.', '_').replaceAll('?', '_')}`)).json();
    let fileNameList: string[] = [];
    for (const k in index) {
        if (Object.prototype.hasOwnProperty.call(index, k)) {
            const v = index[k];
            if (v === by) {
                switch (by) {
                    case EDocumentType.EYE: {
                        // fileNameList.push(`/documents/${by}}/${k}`);
                        fileNameList.push(`/documents/${by}/${k}`);
                        break;
                    }
                    case EDocumentType.EAR: {
                        fileNameList.push(`/documents/${by}/${k}`);
                    }
                }
            }
        }
    }
    let fileName = fileNameList[Math.floor(Math.random()*fileNameList.length)];
    let res: IDocument = {
        fileName: fileName,
        author: author,
        location: _ArtistIndex![author].Location,
    };
    if (by === EDocumentType.EYE) {
        res.gallerySizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_600.png`;
        res.mediumSizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_370.png`;
        res.smallSizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_150.png`;
    }
    return res;
}

export async function GetRandomDocument(baseURL: URL, by: EDocumentType) {
    if (!_DocumentIndex) { await _InitDB(baseURL); }
    let subj = (by === EDocumentType.EAR? _EarDocumentList : _EyeDocumentList)!;
    let choice = subj[Math.floor(Math.random()*subj.length)];
    let fileName = `/documents/${by}/${choice}`;
    let res: IDocument = {
        fileName: fileName,
        author: _DocumentIndex![choice],
        location: _ArtistIndex![_DocumentIndex![choice]].Location,
    };

    if (by === EDocumentType.EYE) {
        res.gallerySizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_600.png`;
        res.mediumSizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_370.png`;
        res.smallSizePath = `${_EyeSmallRoot}${fileName.substring(_EyeRoot.length, fileName.length-4)}_150.png`;
    }
    return res;
}
