package com.groupe.gestion_.de_.notes.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // This ensures an HTTP 404 status code
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName) {
        super(String.format("%s not found with %s : '%s'", resourceName));
    }

}


/*@ResponseStatus(HttpStatus.NOT_FOUND) // This makes Spring respond with a 404 Not Found status code
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}*/