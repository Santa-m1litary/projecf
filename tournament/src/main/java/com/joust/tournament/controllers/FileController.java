package com.joust.tournament.controllers;

import com.joust.tournament.dto.ScoreRequest;
import com.joust.tournament.dto.TeamRatingResponse;
import com.joust.tournament.models.FileEntity;
import com.joust.tournament.services.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // Загрузка файла командой
    // POST /api/uploads?teamId=xxx&teamName=xxx
    @PostMapping
    public ResponseEntity<String> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "teamId",   required = false) String teamId,
            @RequestParam(value = "teamName", required = false) String teamName
    ) throws IOException {
        fileService.save(file, teamId, teamName);
        return ResponseEntity.ok("Файл завантажено");
    }

    // Все файлы (для жюри/админа)
    // GET /api/uploads
    @GetMapping
    public ResponseEntity<List<FileEntity>> getFiles() {
        return ResponseEntity.ok(fileService.getAll());
    }

    // Файлы конкретной команды
    // GET /api/uploads/team/{teamId}
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<FileEntity>> getByTeam(@PathVariable String teamId) {
        return ResponseEntity.ok(fileService.getByTeam(teamId));
    }

    // Оценить файл (жюри/админ)
    // PUT /api/uploads/{id}/score
    @PutMapping("/{id}/score")
    public ResponseEntity<FileEntity> score(
            @PathVariable Long id,
            @RequestBody ScoreRequest req) {
        return ResponseEntity.ok(fileService.score(id, req));
    }

    // Рейтинг команд
    // GET /api/uploads/ratings
    @GetMapping("/ratings")
    public ResponseEntity<List<TeamRatingResponse>> getRatings() {
        return ResponseEntity.ok(fileService.getTeamRatings());
    }
}