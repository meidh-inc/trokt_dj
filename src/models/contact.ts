export default class Contact {
    user_email: string;
    group_name: string;

    constructor(userEmail: string = '', groupName: string = '') {
        this.user_email = userEmail;
        this.group_name = groupName;
    }
}