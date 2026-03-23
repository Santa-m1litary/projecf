package com.joust.tournament.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Post {

    @Id
    private Long id;

    private String title, anons, fill_text;
    private int views;


}
