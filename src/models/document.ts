export default class Document {
    doc_id: number;
    doc_name: string;
    url?: string;

    constructor(docId: number = null, docName: string = '', url: string = '') {
        this.doc_id = docId;
        this.doc_name = docName;
        this.url = url;
    }
}