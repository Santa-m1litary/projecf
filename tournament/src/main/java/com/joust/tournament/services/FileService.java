package com.joust.tournament.services;

import com.joust.tournament.models.FileEntity;
import com.joust.tournament.repository.FileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FileService {

    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public void save(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String path = uploadDir + fileName;
        Files.copy(file.getInputStream(), Paths.get(path));

        FileEntity entity = new FileEntity();
        entity.setFileName(file.getOriginalFilename()); // оригинальное имя для отображения
        entity.setFilePath(path);
        entity.setSize(file.getSize());
        entity.setUploadedAt(LocalDateTime.now()); // ← фиксируем время загрузки
        fileRepository.save(entity);
    }

    // ← ЭТОГО не хватало!
    public List<FileEntity> getAll() {
        return fileRepository.findAll();
    }
}