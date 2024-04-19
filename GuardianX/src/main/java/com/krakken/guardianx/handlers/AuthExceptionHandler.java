package com.krakken.guardianx.handlers;

import com.krakken.guardianx.exceptions.PasswordMismatchException;
import com.krakken.guardianx.exceptions.UserDoesNotExistException;
import com.krakken.guardianx.exceptions.UserExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class AuthExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {UserExistsException.class})
    protected ResponseEntity<Object> handleUserExistsException(final UserExistsException ex, final WebRequest request) {
        String responseBody = ex.getMessage();
        log.error("User exists exception: {}", responseBody);
        return handleExceptionInternal(ex, responseBody, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(value = {UserDoesNotExistException.class})
    protected ResponseEntity<Object> handleUserDoesNotExistException(final UserDoesNotExistException ex, final WebRequest request) {
        String responseBody = ex.getMessage();
        log.error("User not found exception: {}", responseBody);
        return handleExceptionInternal(ex, responseBody, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(value = {PasswordMismatchException.class})
    protected ResponseEntity<Object> handlePasswordMismatchException(final PasswordMismatchException ex, final WebRequest request) {
        String responseBody = ex.getMessage();
        log.error("Password mismatch found: {}", responseBody);
        return handleExceptionInternal(ex, responseBody, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }
}
