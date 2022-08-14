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

function _InitDB() {
    console.log(`initdb`);
    let indexSource = fs.readFileSync(path.join('static', 'documents', 'index'), {encoding: 'utf-8'});
    _ArtistIndex = JSON.parse(indexSource);
    _DocumentIndex = {};
    _EarDocumentList = [];
    _EyeDocumentList = [];
    for (const k in _ArtistIndex) {
        if (Object.prototype.hasOwnProperty.call(_ArtistIndex, k)) {
            const v = _ArtistIndex[k];
            v.Eye.forEach((n) => { _DocumentIndex![n] = k; _EyeDocumentList?.push(n); });
            v.Ear.forEach((n) => { _DocumentIndex![n] = k; _EarDocumentList?.push(n); });
            _ArtistIndex[k].Name = k;
        }
    }
}

export function ArtistIndex() {
    if (!_ArtistIndex) { _InitDB(); }
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

export function GetAuthorBy(by: EDocumentType): IArtist[] {
    if (!_ArtistIndex) { _InitDB(); }
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

export function GetRandomDocumentByAuthor(by: EDocumentType, author: string): IDocument {
    if (!_ArtistIndex) { _InitDB(); }
    let indexFileName = path.join('static', 'documents', `index.${author.replaceAll(':', '_').replaceAll('.', '_').replaceAll('?', '_')}`);
    let indexFileSource = fs.readFileSync(indexFileName, {encoding: 'utf-8'});
    let index = JSON.parse(indexFileSource);
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

export function GetRandomDocument(by: EDocumentType): IDocument {
    if (!_DocumentIndex) { _InitDB(); }
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
