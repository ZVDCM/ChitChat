import Converter from './converter.js';
import { TOKENS, USERS } from '../const/database.js';

class Ref {
    static users(database: FirebaseFirestore.Firestore): any {
        return database.collection(USERS).withConverter(Converter.user());
    }
    static tokens(database: FirebaseFirestore.Firestore): any {
        return database.collection(TOKENS).withConverter(Converter.token());
    }
}

export default Ref;
