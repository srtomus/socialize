export class Group{
    constructor(
        public _id: string,
        public name: string,
        public author: string,
        public description: string,
        public nr_members: number,
        public created_at: string,
        public image: string,
        public date_at: string
    ) {}
}