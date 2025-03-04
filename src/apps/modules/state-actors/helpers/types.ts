
export interface QuoteDto {
    id: string;
    text: string;
    author_id: string | null;
    collections_id: string | null;
    created_at: string;
}

export interface AuthorDto {
    id: string;
    fullname: string;
    birth_date: string | null;
}

export interface CollectionDto {
    id: string;
    name: string;
    parent_id: string | null;
}


export type AuthorEvents =
    {
        type: "editing.start";
    }
    | {
    type: "editing.cancel"; }
    | {
    type: "editing.submit";
    fullname: string;
    birthday: string;
}

export type QuoteEvents = { type: "delete" }
    | {
    type: "editing.start";
}
    | {
    type: "editing.cancel";
}
    | {
    type: "editing.submit";
    authorId: string;
    text: string;
    collectionId: string | undefined;
}


export type CollectionEvents = {
        type: "editing.start";
    }
    | {
    type: "editing.cancel";
}
    | {
    type: "editing.submit";
    name: string;
}

export type AppEvents = { type: "quote.delete.confirmed"; quoteId: string }
    | { type: "quote.new.open" }
    | { type: "quote.new.cancel" }
    | {
    type: "quote.new.submit";
    text: string;
    authorId: string;
}
    | { type: "author.new.open" }
    | { type: "author.new.cancel" }
    | {
    type: "author.new.submit";
    fullname: string;
    birthday: string | undefined;
}
