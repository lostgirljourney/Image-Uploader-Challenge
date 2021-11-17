import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyD8GSIdO1zrvTDb1VhgrhPAjFW-FnBV2i8",
	authDomain: "image-uploader-project.firebaseapp.com",
	projectId: "image-uploader-project",
	storageBucket: "image-uploader-project.appspot.com",
	messagingSenderId: "677907959243",
	appId: "1:677907959243:web:2c5803bcb66ca8f697ba4e",
	measurementId: "G-2CKMG5Q5XJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage, app };
