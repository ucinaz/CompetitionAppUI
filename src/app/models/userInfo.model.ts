export class UserInfo {
    user_id: number = 0;
    username: string = '';
    password: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    registerDate: Date = new Date();
    activationGUID: string = '';
    contestRegistered: number = 0;
    jwt_key: string = '';
    userActivated = 0;
    isAdmin = 0;
}
