package com.joust.tournament.controllers;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.joust.tournament.controllers.Post;
import com.joust.tournament.controllers.PostRepository;


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