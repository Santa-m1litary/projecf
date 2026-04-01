package com.joust.tournament.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;
    private Long size;
    private LocalDateTime uploadedAt;

    private String teamId;    // ← какая команда загрузила
    private String teamName;  // ← название команды

    // Оценки жюри (каждый критерий из 100 в сумме)
    private Integer scoreQuality;     // Якість роботи (40 макс)
    private Integer scoreTechnical;   // Технічне виконання (30 макс)
    private Integer scoreCreativity;  // Креативність (20 макс)
    private Integer scoreDesign;      // Оформлення (10 макс)

    private String juryComment;       // Комментарий жюри
    private String juryName;          // Кто оценил
    private LocalDateTime scoredAt;   // Когда оценили

    // Итоговый балл считается автоматически
    public Integer getTotalScore() {
        if (scoreQuality == null && scoreTechnical == null
                && scoreCreativity == null && scoreDesign == null) return null;
        int q = scoreQuality   != null ? scoreQuality   : 0;
        int t = scoreTechnical != null ? scoreTechnical : 0;
        int c = scoreCreativity != null ? scoreCreativity : 0;
        int d = scoreDesign    != null ? scoreDesign    : 0;
        return q + t + c + d;
    }

    public Long getId()                  { return id; }
    public String getFileName()          { return fileName; }
    public void setFileName(String f)    { this.fileName = f; }
    public String getFilePath()          { return filePath; }
    public void setFilePath(String f)    { this.filePath = f; }
    public Long getSize()                { return size; }
    public void setSize(Long s)          { this.size = s; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime t) { this.uploadedAt = t; }
    public String getTeamId()            { return teamId; }
    public void setTeamId(String t)      { this.teamId = t; }
    public String getTeamName()          { return teamName; }
    public void setTeamName(String t)    { this.teamName = t; }
    public Integer getScoreQuality()     { return scoreQuality; }
    public void setScoreQuality(Integer s)    { this.scoreQuality = s; }
    public Integer getScoreTechnical()   { return scoreTechnical; }
    public void setScoreTechnical(Integer s)  { this.scoreTechnical = s; }
    public Integer getScoreCreativity()  { return scoreCreativity; }
    public void setScoreCreativity(Integer s) { this.scoreCreativity = s; }
    public Integer getScoreDesign()      { return scoreDesign; }
    public void setScoreDesign(Integer s)     { this.scoreDesign = s; }
    public String getJuryComment()       { return juryComment; }
    public void setJuryComment(String j) { this.juryComment = j; }
    public String getJuryName()          { return juryName; }
    public void setJuryName(String j)    { this.juryName = j; }
    public LocalDateTime getScoredAt()   { return scoredAt; }
    public void setScoredAt(LocalDateTime t) { this.scoredAt = t; }
}