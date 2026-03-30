package com.joust.tournament.models;

public class User {
    private String id;
    private String name;
    private String role;
    private String code;
    private String email;
    private String password;

    public User() {}

    public User(String id, String name, String role, String code, String email, String password) {
        this.id       = id;
        this.name     = name;
        this.role     = role;
        this.code     = code;
        this.email    = email;
        this.password = password;
    }

    public String getId()       { return id; }
    public String getName()     { return name; }
    public String getRole()     { return role; }
    public String getCode()     { return code; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }

    public void setId(String id)           { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setRole(String role)       { this.role = role; }
    public void setCode(String code)       { this.code = code; }
    public void setEmail(String email)     { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}