package com.cmpe275.termproject.Model.Response;

import org.springframework.http.HttpStatus;

public class Response {
    public String message;
    public HttpStatus statusCode;

    public Response(String message, HttpStatus statusCode){
        this.message = message;
        this.statusCode = statusCode;
    }
}
