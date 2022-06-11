//package com.cmpe275.termproject.Utilities;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;
//import org.springframework.stereotype.Service;
//import org.springframework.util.ResourceUtils;
//
//import javax.annotation.PostConstruct;
//import java.io.File;
//import java.io.FileInputStream;
//
//@Service
//public class FirebaseConfig {
//
//    @PostConstruct
//    public void initialize() {
//        try {
//                File file = new File("src/main/resources/cmpe275termproject-e0975-firebase-adminsdk-i3kpp-2cde45effe.json");
//                FileInputStream serviceAccount =
//                        new FileInputStream(file);
//
//                FirebaseOptions options = new FirebaseOptions.Builder()
//                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                        .setDatabaseUrl("https://cmpe275termproject-e0975-default-rtdb.firebaseio.com")
//                        .build();
//
//                FirebaseApp.initializeApp(options);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//    }
//}
