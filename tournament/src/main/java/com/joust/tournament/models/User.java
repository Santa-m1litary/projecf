package com.joust.tournament.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean emailVerified = false; // ← добавили с дефолтным значением

    public User() {}

    public User(String id, String name, String role, String code, String email, String password) {
        this.id           = id;
        this.name         = name;
        this.role         = role;
        this.code         = code;
        this.email        = email;
        this.password     = password;
        this.emailVerified = false; // ← дефолт
    }

    public String getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getRole(){
        return role;
    }
    public String getCode(){
        return code;
    }
    public String getEmail(){
        return email;
    }
    public String getPassword(){
        return password;
    }
    public boolean isEmailVerified(){
        return emailVerified;
    }

    public void setId(String id){
        this.id = id;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setRole(String role){
        this.role = role;
    }
    public void setCode(String code){ this.code = code;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public void setEmailVerified(boolean emailVerified){
        this.emailVerified = emailVerified;
    }
}