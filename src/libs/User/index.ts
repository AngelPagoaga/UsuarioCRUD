import { getConnection } from "@models/sqlite/SqlConn";
import { UserDao } from "@models/sqlite/UserDao";

export interface IUser{
    _id?: unknown;
    nombreCompleto: string;
    email: string;
    password: string;
}

export class User{
    private dao:UserDao;
    public constructor(){
        getConnection()
          .then(conn=>{
            this.dao = new UserDao(conn);
          })
          .catch(ex=>console.error(ex));
      }
    //Consultas a realizar de Usuario
    public getAllUser() {
        return this.dao.getUsers()
      }
      public getUserByIndex( index:number) {
          return this.dao.getUserById({_id:index});
      }
    
      public addUser(user:IUser) {
        return this.dao.insertNewUser(user);
      }
      public updateUser(index:number, user:IUser){
       return this.dao.update({_id:index}, user);
      }
      public deleteUser( index:number) {
        return this.dao.deleteUser({_id:index});
      }


}