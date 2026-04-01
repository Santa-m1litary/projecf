package com.joust.tournament.dto;

public class ScoreRequest {
    private Integer scoreQuality;    // макс 40
    private Integer scoreTechnical;  // макс 30
    private Integer scoreCreativity; // макс 20
    private Integer scoreDesign;     // макс 10
    private String juryComment;
    private String juryName;

    public Integer getScoreQuality()         { return scoreQuality; }
    public void setScoreQuality(Integer s)   { this.scoreQuality = s; }
    public Integer getScoreTechnical()       { return scoreTechnical; }
    public void setScoreTechnical(Integer s) { this.scoreTechnical = s; }
    public Integer getScoreCreativity()      { return scoreCreativity; }
    public void setScoreCreativity(Integer s){ this.scoreCreativity = s; }
    public Integer getScoreDesign()          { return scoreDesign; }
    public void setScoreDesign(Integer s)    { this.scoreDesign = s; }
    public String getJuryComment()           { return juryComment; }
    public void setJuryComment(String j)     { this.juryComment = j; }
    public String getJuryName()              { return juryName; }
    public void setJuryName(String j)        { this.juryName = j; }
}