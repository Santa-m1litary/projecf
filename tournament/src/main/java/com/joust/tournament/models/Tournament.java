package com.joust.tournament.models;

import java.util.ArrayList;
import java.util.List;

public class Tournament {
    private String id;
    private String name;
    private String status; // "active" | "finished"
    private String createdBy;
    private List<Team> teams = new ArrayList<>();

    public Tournament() {}

    public Tournament(String id, String name, String createdBy) {
        this.id        = id;
        this.name      = name;
        this.createdBy = createdBy;
        this.status    = "active";
    }

    public String getId()            { return id; }
    public String getName()          { return name; }
    public String getStatus()        { return status; }
    public String getCreatedBy()     { return createdBy; }
    public List<Team> getTeams()     { return teams; }

    public void setId(String id)           { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setStatus(String status)   { this.status = status; }
    public void setCreatedBy(String c)     { this.createdBy = c; }
    public void setTeams(List<Team> teams) { this.teams = teams; }
}
