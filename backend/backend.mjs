import mojo from '@mojojs/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2Eg_Z-G2t3q23UtwzIPNcc3J-HQMfG8A",
    authDomain: "moon-atlas.firebaseapp.com",
    projectId: "moon-atlas",
    storageBucket: "moon-atlas.appspot.com",
    messagingSenderId: "868279660727",
    appId: "1:868279660727:web:b7afc7bd92600c2033dd32",
    measurementId: "G-XYE2ENJBEM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

const app = mojo();

app.get('/', ctx => ctx.render({ text: 'test2' }));

app.start();
