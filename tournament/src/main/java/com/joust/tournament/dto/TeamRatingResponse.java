package com.joust.tournament.dto;

public class TeamRatingResponse {
    private String teamId;
    private String teamName;
    private double averageScore;  // средний балл
    private int totalFiles;       // кол-во работ
    private int scoredFiles;      // кол-во оценённых работ

    public TeamRatingResponse(String teamId, String teamName,
                              double averageScore, int totalFiles, int scoredFiles) {
        this.teamId       = teamId;
        this.teamName     = teamName;
        this.averageScore = averageScore;
        this.totalFiles   = totalFiles;
        this.scoredFiles  = scoredFiles;
    }

    public String getTeamId()        { return teamId; }
    public String getTeamName()      { return teamName; }
    public double getAverageScore()  { return averageScore; }
    public int getTotalFiles()       { return totalFiles; }
    public int getScoredFiles()      { return scoredFiles; }
}