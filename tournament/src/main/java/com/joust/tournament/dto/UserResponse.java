package com.joust.tournament.dto;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String code;

    public UserResponse(String id, String name, String email, String role, String code) {
        this.id    = id;
        this.name  = name;
        this.email = email;
        this.role  = role;
        this.code  = code;
    }

    public String getId()    { return id; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
    public String getRole()  { return role; }
    public String getCode()  { return code; }
}