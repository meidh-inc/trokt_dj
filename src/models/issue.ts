export default class Issue {
    group_id: number;
    document_id: number;
    section_id: number;
    user_id: number;
    details: string;

    constructor(groupId: number = null, documentId: number = null,
                sectionId: number = null, userId: number = null, details: string = '') {
        this.group_id = groupId;
        this.document_id = documentId;
        this.section_id = sectionId;
        this.user_id = userId;
        this.details = details;
    }
}