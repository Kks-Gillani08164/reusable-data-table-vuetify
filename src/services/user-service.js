import axios from "axios";

export class UserService {
  async fetchAll() {
    return (await axios.get("/users")).data;
  }
}
