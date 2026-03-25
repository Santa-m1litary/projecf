package com.joust.tournament.models;

import java.util.ArrayList;
import java.util.List;

public class Team {
    private String id;
    private String name;
    private String code;
    private List<String> members = new ArrayList<>();

    public Team() {}

    public Team(String id, String name, String code) {
        this.id   = id;
        this.name = name;
        this.code = code;
    }

    public String getId()              { return id; }
    public String getName()            { return name; }
    public String getCode()            { return code; }
    public List<String> getMembers()   { return members; }

    public void setId(String id)           { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setCode(String code)       { this.code = code; }
    public void setMembers(List<String> m) { this.members = m; }
}
