export class Publication{
  concat(arrayB: any): Publication {
    throw new Error("Method not implemented.");
  }
    constructor(
        public _id: string,
        public text: string,
        public file: string,
        public created_at: string,
        public user: string
    ) {}
}