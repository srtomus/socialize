export class User{
    gettoken: any;
    constructor(
        public _id: string,
        public name: string,
        public nickname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string,
        public interests: string[]
    ) {}
}