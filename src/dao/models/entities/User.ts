//Declaracion de la entidad usuario por medio de Interface.
//Recordar que interface me describe la estructura de un objeto.
export interface IUser{
    _id?: unknown;
    nombreCompleto: string;
    email: string;
    password: string;
}