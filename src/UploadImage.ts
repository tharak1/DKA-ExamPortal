import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { databaseStorage } from "./firebase_config";

const uploadImage = async (image: File, name: string, folder: string) => {
    if (!image) return '';
    const imageRef = ref(databaseStorage, `${folder}/${name + uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, image);
    return await getDownloadURL(snapshot.ref);
};

export default uploadImage;
