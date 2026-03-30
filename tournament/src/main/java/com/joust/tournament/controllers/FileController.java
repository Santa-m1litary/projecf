package com.joust.tournament.controllers;

import com.joust.tournament.models.FileEntity;
import com.joust.tournament.services.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*") // ← разрешаем фронтенду обращаться
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        fileService.save(file);
        return ResponseEntity.ok("File uploaded");
    }

    // ← ЭТОГО не хватало!
    @GetMapping
    public ResponseEntity<List<FileEntity>> getFiles() {
        return ResponseEntity.ok(fileService.getAll());
    }
}