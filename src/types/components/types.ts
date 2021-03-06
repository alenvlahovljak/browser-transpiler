export interface ICode {
    id?: string;
    language: string;
    value: string;
    onChange: (value: string) => void;
}
