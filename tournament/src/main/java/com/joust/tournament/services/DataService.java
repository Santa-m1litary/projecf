package com.joust.tournament.services;


import com.joust.tournament.models.Team;
import com.joust.tournament.models.Tournament;
import com.joust.tournament.models.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DataService {

    private final Map<String, User>       users       = new LinkedHashMap<>();
    private final Map<String, Team>       teams       = new LinkedHashMap<>();
    private final Map<String, Tournament> tournaments = new LinkedHashMap<>();

    // ======= USERS =======

    public User registerUser(String name, String role, String email, String password) {
        // Check email already exists
        for (User u : users.values()) {
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(email)) {
                return null; // already exists
            }
        }
        String id   = UUID.randomUUID().toString().substring(0, 8);
        String code = generateUserCode(name);
        User user   = new User();
        users.put(id, user);
        return user;
    }

    public User loginUser(String email, String password) {
        for (User u : users.values()) {
            if (u.getEmail() != null && u.getEmail().equalsIgnoreCase(email)
                    && u.getPassword() != null && u.getPassword().equals(password)) {
                return u;
            }
        }
        return null;
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    public User getUserByCode(String code) {
        return users.values().stream()
                .filter(u -> u.getCode().equalsIgnoreCase(code))
                .findFirst().orElse(null);
    }



    public boolean deleteUser(String id) {
        return users.remove(id) != null;
    }

    // ======= TEAMS =======

    public Team createTeam(String name) {
        String id   = UUID.randomUUID().toString().substring(0, 8);
        String code = generateTeamCode(name);
        Team team   = new Team(id, name, code);
        teams.put(id, team);
        return team;
    }

    public List<Team> getAllTeams() {
        return new ArrayList<>(teams.values());
    }

    public Team getTeamByCode(String code) {
        return teams.values().stream()
                .filter(t -> t.getCode().equalsIgnoreCase(code))
                .findFirst().orElse(null);
    }

    public Team getTeamById(String id) {
        return teams.get(id);
    }

    public boolean addMemberByCode(String teamId, String userCode) {
        Team team = teams.get(teamId);
        User user = getUserByCode(userCode);
        if (team == null || user == null) return false;
        if (team.getMembers().contains(user.getName())) return false;
        team.getMembers().add(user.getName());
        return true;
    }

    public boolean addMemberByName(String teamId, String name) {
        Team team = teams.get(teamId);
        if (team == null) return false;
        if (team.getMembers().contains(name)) return false;
        team.getMembers().add(name);
        return true;
    }

    public boolean removeMember(String teamId, int memberIndex) {
        Team team = teams.get(teamId);
        if (team == null || memberIndex < 0 || memberIndex >= team.getMembers().size()) return false;
        team.getMembers().remove(memberIndex);
        return true;
    }

    public boolean deleteTeam(String id) {
        return teams.remove(id) != null;
    }

    // ======= TOURNAMENTS =======

    public Tournament createTournament(String name, String createdBy) {
        String id    = UUID.randomUUID().toString().substring(0, 8);
        Tournament t = new Tournament(id, name, createdBy);
        tournaments.put(id, t);
        return t;
    }

    public List<Tournament> getAllTournaments() {
        return new ArrayList<>(tournaments.values());
    }

    public boolean addTeamToTournament(String tournamentId, String teamCode) {
        Tournament t = tournaments.get(tournamentId);
        Team team    = getTeamByCode(teamCode);
        if (t == null || team == null) return false;
        boolean exists = t.getTeams().stream().anyMatch(tm -> tm.getCode().equals(team.getCode()));
        if (exists) return false;
        t.getTeams().add(team);
        return true;
    }

    public boolean removeTeamFromTournament(String tournamentId, String teamId) {
        Tournament t = tournaments.get(tournamentId);
        if (t == null) return false;
        return t.getTeams().removeIf(tm -> tm.getId().equals(teamId));
    }

    public boolean toggleTournamentStatus(String id) {
        Tournament t = tournaments.get(id);
        if (t == null) return false;
        t.setStatus(t.getStatus().equals("active") ? "finished" : "active");
        return true;
    }

    public boolean deleteTournament(String id) {
        return tournaments.remove(id) != null;
    }

    // ======= HELPERS =======

    private String generateUserCode(String name) {
        String base = name.replaceAll("[^a-zA-Zа-яА-ЯіІїЇєЄ]", "")
                .toUpperCase();
        base = base.substring(0, Math.min(3, base.length()));
        if (base.isEmpty()) base = "USR";
        int num = 1000 + new Random().nextInt(9000);
        return base + "-" + num;
    }

    private String generateTeamCode(String name) {
        String base = name.replaceAll("[^a-zA-Zа-яА-ЯіІїЇєЄ]", "")
                .toUpperCase();
        base = base.substring(0, Math.min(4, base.length()));
        if (base.isEmpty()) base = "TEAM";
        int num = 100 + new Random().nextInt(900);
        return "TEAM-" + base + "-" + num;
    }
}
