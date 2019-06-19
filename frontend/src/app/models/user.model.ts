export class User{
    gettoken: any;
    constructor(
        public _id: string,
        public name: string,
        public lastname: string,
        public description: string,
        public nickname: string,
        public email: string,
        public age: Number,
        public gender: string,
        public password: string,
        public role: string,
        public image: string,
        public interests: Array<String>
    ) {}
}