export interface Recipe {
    "id"?: string;
    "title": string;
    "description": string;
    "image": string;
    "vegitarian": string;
    "createAt"?: Date;
    "likes"?: Array<number>;
    "user_id"?: string;
}