export class Publication{
  length(length: any) {
    throw new Error("Method not implemented.");
  }
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