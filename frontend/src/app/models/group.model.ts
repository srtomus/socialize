export class Group{
  concat(arrayB: any): Group {
    throw new Error("Method not implemented.");
  }
    constructor(
        public _id: string,
        public name: string,
        public author: string,
        public description: string,
        public category: string,
        public nr_members: number,
        public members: number,
        public created_at: string,
        public date_at: string,
        public lat: string,
        public lng: string
    ) {}
}