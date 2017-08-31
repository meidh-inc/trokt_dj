export default class Group {
    group_id: number;
    group_name: string;

    constructor(groupId: number = null, groupName: string = '') {
        this.group_id = groupId;
        this.group_name = groupName;
    }
}