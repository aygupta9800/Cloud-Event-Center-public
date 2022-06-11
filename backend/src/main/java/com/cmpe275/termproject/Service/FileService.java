//package com.cmpe275.termproject.Service;
//
//import com.cmpe275.termproject.Model.Response.Response;
//import com.cmpe275.termproject.Repository.ForumRepo;
//import com.google.auth.Credentials;
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.cloud.storage.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.util.ResourceUtils;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.FileInputStream;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.nio.file.Files;
//import java.nio.file.Paths;
//import java.util.UUID;
//
//@Service
//public class FileService {
//
//
//    @Value( "${DOWNLOAD_URL}" )
//    private String DOWNLOAD_URL;
//
//    private String uploadFile(File file, String fileName) throws IOException {
//        BlobId blobId = BlobId.of("cmpe275termproject-e0975.appspot.com", fileName);
//        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
//        File jsonFile = ResourceUtils.getFile("classpath:cmpe275termproject-e0975-firebase-adminsdk-i3kpp-2cde45effe.json");
//        FileInputStream fileInputStream =
//                new FileInputStream(jsonFile);
//        Credentials credentials = GoogleCredentials.fromStream(fileInputStream);
//        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
//        storage.create(blobInfo, Files.readAllBytes(file.toPath()));
//        return String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
//    }
//
//    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
//        File tempFile = new File(fileName);
//        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
//            fos.write(multipartFile.getBytes());
//            fos.close();
//        }
//        return tempFile;
//    }
//
//    private String getExtension(String fileName) {
//        return fileName.substring(fileName.lastIndexOf("."));
//    }
//
//    public Object upload(MultipartFile multipartFile) {
//
//        try {
//            String fileName = multipartFile.getOriginalFilename();                        // to get original file name
//            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));  // to generated random string values for file name.
//
//            File file = this.convertToFile(multipartFile, fileName);                      // to convert multipartFile to File
//            String IMAGE_URL = this.uploadFile(file, fileName);                                   // to get uploaded file link
//            file.delete();
//
//
//
//            return new ResponseEntity<>(new Response(IMAGE_URL, HttpStatus.OK), HttpStatus.OK);                     // Your customized response
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(new Response("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//
//    }
//
////    public Object download(String fileName) throws IOException {
////        String destFileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));     // to set random strinh for destination file name
////        String destFilePath = "Z:\\New folder\\" + destFileName;                                    // to set destination file path
////
////        ////////////////////////////////   Download  ////////////////////////////////////////////////////////////////////////
////        File jsonFile = ResourceUtils.getFile("classpath:cmpe275termproject-e0975-firebase-adminsdk-i3kpp-2cde45effe.json");
////        FileInputStream fileInputStream =
////                new FileInputStream(jsonFile);
////        Credentials credentials = GoogleCredentials.fromStream(fileInputStream);
////        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
////        Blob blob = storage.get(BlobId.of("cmpe275termproject-e0975.appspot.com", fileName));
////        blob.downloadTo(Paths.get(destFilePath));
////        return new ResponseEntity<>(new Response("Successfully downloaded", HttpStatus.OK), HttpStatus.OK);
////    }
//}
