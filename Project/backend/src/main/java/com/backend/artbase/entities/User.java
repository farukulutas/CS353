package com.backend.artbase.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    private Integer userId;
    private String userName;
    private String email;
    private String userPassword;
    private UserType userType;
}
