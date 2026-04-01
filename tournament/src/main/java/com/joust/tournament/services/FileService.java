package com.joust.tournament.services;

import com.joust.tournament.dto.ScoreRequest;
import com.joust.tournament.dto.TeamRatingResponse;
import com.joust.tournament.models.FileEntity;
import com.joust.tournament.repository.FileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileService {

    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    // Загрузка файла командой
    public void save(MultipartFile file, String teamId, String teamName) throws IOException {
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String path = uploadDir + fileName;
        Files.copy(file.getInputStream(), Paths.get(path));

        FileEntity entity = new FileEntity();
        entity.setFileName(file.getOriginalFilename());
        entity.setFilePath(path);
        entity.setSize(file.getSize());
        entity.setUploadedAt(LocalDateTime.now());
        entity.setTeamId(teamId);
        entity.setTeamName(teamName != null ? teamName : "");

        fileRepository.save(entity);
    }

    // Для старого метода без команды
    public void save(MultipartFile file) throws IOException {
        save(file, null, null);
    }

    // Все файлы
    public List<FileEntity> getAll() {
        return fileRepository.findAll();
    }

    // Файлы конкретной команды
    public List<FileEntity> getByTeam(String teamId) {
        return fileRepository.findAll().stream()
                .filter(f -> teamId.equals(f.getTeamId()))
                .collect(Collectors.toList());
    }

    // Оценить файл (только жюри/админ)
    public FileEntity score(Long fileId, ScoreRequest req) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Файл не знайдено"));

        // Валидация баллов
        if (req.getScoreQuality()    != null && (req.getScoreQuality()    < 0 || req.getScoreQuality()    > 40))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Якість: 0-40 балів");
        if (req.getScoreTechnical()  != null && (req.getScoreTechnical()  < 0 || req.getScoreTechnical()  > 30))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Технічне: 0-30 балів");
        if (req.getScoreCreativity() != null && (req.getScoreCreativity() < 0 || req.getScoreCreativity() > 20))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Креативність: 0-20 балів");
        if (req.getScoreDesign()     != null && (req.getScoreDesign()     < 0 || req.getScoreDesign()     > 10))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Оформлення: 0-10 балів");

        file.setScoreQuality(req.getScoreQuality());
        file.setScoreTechnical(req.getScoreTechnical());
        file.setScoreCreativity(req.getScoreCreativity());
        file.setScoreDesign(req.getScoreDesign());
        file.setJuryComment(req.getJuryComment());
        file.setJuryName(req.getJuryName());
        file.setScoredAt(LocalDateTime.now());

        return fileRepository.save(file);
    }

    // Рейтинг команд — сортировка по среднему баллу
    public List<TeamRatingResponse> getTeamRatings() {
        List<FileEntity> allFiles = fileRepository.findAll();

        // Группируем по команде
        Map<String, List<FileEntity>> byTeam = allFiles.stream()
                .filter(f -> f.getTeamId() != null)
                .collect(Collectors.groupingBy(FileEntity::getTeamId));

        List<TeamRatingResponse> ratings = byTeam.entrySet().stream().map(entry -> {
            String teamId   = entry.getKey();
            List<FileEntity> files = entry.getValue();
            String teamName = files.get(0).getTeamName();

            List<FileEntity> scored = files.stream()
                    .filter(f -> f.getTotalScore() != null)
                    .collect(Collectors.toList());

            double avg = scored.stream()
                    .mapToInt(FileEntity::getTotalScore)
                    .average()
                    .orElse(0.0);

            return new TeamRatingResponse(teamId, teamName,
                    Math.round(avg * 10.0) / 10.0, files.size(), scored.size());
        }).collect(Collectors.toList());

        // Сортируем по среднему баллу — от высшего к низшему
        ratings.sort((a, b) -> Double.compare(b.getAverageScore(), a.getAverageScore()));
        return ratings;
    }
}