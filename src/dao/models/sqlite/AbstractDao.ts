//Imports a utilizar.
import { IDaoObject } from "@server/dao/daoBase";
import  sqlite from 'sqlite';

export abstract class AbstractDao<T> implements IDaoObject{
    public persistanceName: string; //Nombre de la tabla, en este caso Usuario/User.
    private connection: sqlite.Database; //Conexion a requerir.

    constructor(persistanceName: string, connection?:sqlite.Database){
        this.persistanceName = persistanceName;//igualamos valores.
        if(connection){
            this.connection = connection;//igualamos valores.
        } 
    }
    //Aplicación de funciones.

    public async findAll(): Promise<T[]>{ //obtendremos toda la información. 
        const sqlStr = `SELECT * from ${this.persistanceName};`;
        const datos = await this.connection.all(sqlStr);
        return datos;
    }

    public async findByID(identifier: Partial<T>): Promise<T[]>{
        const {columns, values, params:_params} = this.getColValParmArr(identifier);
        const sqlSelect = `SELECT * from ${this.persistanceName} where ${columns.map(o=>`${o}=?`).join(' and ')};`;
        const dato = await this.connection.get(sqlSelect, values);
        return dato;
    }

    public async createOne( data: T): Promise<T>{
        const {columns, values, params} = this.getColValParmArr(data);
        const sqlInsert = `INSERT INTO ${this.persistanceName} (${columns.join(', ')}) VALUES (${params.join(', ')});`;
        console.log(sqlInsert, values);
        await this.connection.run(sqlInsert, values);
        return data;
    }
    public async update(identifier: Partial<T>, data: Partial<T>):Promise<boolean> {
    const {columns, values, params:_params} = this.getColValParmArr(data);
    const {columns:columnsId, values:valuesId, params:_paramsId} = this.getColValParmArr(identifier);
    const finalValues = [...values, ...valuesId];
    const sqlUpdate = `UPDATE ${this.persistanceName} SET ${columns.map((o)=>`${o}=?`).join(', ')} WHERE ${columnsId.map((o)=>`${o}=?`).join(' ')};`;
    await this.connection.run(sqlUpdate, finalValues);
    return true;
    }
    public async delete(identifier: Partial<T>): Promise<boolean>{
        const {columns, values, params: _params} = this.getColValParmArr(identifier);
        const sqlDelete = `DELETE from ${this.persistanceName} where ${columns.map(o=>`${o}=?`).join(' and ')};`;
        await this.connection.run(sqlDelete, values);
        return true;
      }

    //getColValParmArr nos permite optimizar codigo.    
    private getColValParmArr ( data: Partial<T>): {columns:string[], values:unknown[], params:string[]} {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const params = columns.map(()=>'?');
        return {columns, values, params};
    }

    public exec(sqlstr: string){
        return this.connection.exec(sqlstr);
      }
}