package com.joust.tournament.controllers;

import com.joust.tournament.models.Post;
import com.joust.tournament.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostRepository repo;

    public PostController(PostRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        return repo.save(post);
    }

    @GetMapping
    public List<Post> getAll() {
        return repo.findAll();
    }
}